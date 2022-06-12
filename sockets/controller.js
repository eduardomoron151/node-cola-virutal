const { Socket } = require("socket.io");

const TicketControl = require('../models/ticket-control');
const ticketControl = new TicketControl();

const { comprobarJWT } = require('../helpers/generar-jwt')

const socketController = async(socket = new Socket(), io) => {

    const token = socket.handshake.headers['x-token'];
    const usuario = await comprobarJWT(token);

    socket.emit('ultimo-ticket', await ticketControl.ultimoTicket());
    socket.emit('tickets-pendientes', await ticketControl.ticketPendiente());

    socket.emit('estado-actual', await ticketControl.ultimos4());

    socket.on('siguiente-ticket', async ( {cedula}, callback ) => {
        
        const siguiente = await ticketControl.siguiente(cedula);
        callback(siguiente);
        // socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

            socket.broadcast.emit('tickets-pendientes', await ticketControl.ticketPendiente());

    });

    socket.on('atender-ticket', async (payload, callback) => {
        if(!payload) {
            return callback({
                ok : false,
                msg : 'El usuario es obligatorio'
            });
        }

        const ticketAtender = await ticketControl.atenderTicket(payload);
    
        socket.broadcast.emit('estado-actual', await ticketControl.ultimos4());

        socket.emit('tickets-pendientes', await ticketControl.ticketPendiente());
        socket.broadcast.emit('tickets-pendientes', await ticketControl.ticketPendiente());


        callback(ticketAtender);
    });

}   


module.exports = {
    socketController
}