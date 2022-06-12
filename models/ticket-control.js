const Ticket = require('./ticket');

class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.fecha = new Date().toISOString().slice(0, 10);

    }

    async siguiente(cedula) {

        // Validar que el usuario no tenga ticket registrado
        const query = {
            cedula : Number(cedula),
            fecha : new Date().toISOString().slice(0, 10)
        }
        const validarCedula = await Ticket.find(query);

        if(validarCedula.length > 0) {
            return {
                msg : `La cedula ${cedula} ya posse ticket para el dia de hoy, Nro ticket ${validarCedula[0].numero}`
            }
        }


        // obtenemos el ultimo ticket creado
        const ultimoNumero = await this.ultimoTicket();
        this.ultimo = ultimoNumero + 1;

        // Creamos la data
        const data = {
            numero : this.ultimo,
            atendido : false,
            cedula : Number(cedula),
            fecha : this.fecha,
            usuario : null
        }

        // Guardamos la data
        const ticket = new Ticket(data);
        await ticket.save();

        return ticket;
    }

    async ultimoTicket() {
        // buscar todos los tickets pendientes del dia
        const query = { 
            fecha : new Date().toISOString().slice(0, 10)
        }

        const cantidadTickets = await Ticket.countDocuments(query);
        return cantidadTickets;
    }

    async atenderTicket(usuario) {

        const { uid } = usuario;

        const query = {
            atendido : false,
            usuario : null
        }

        const ticket = await Ticket.findOneAndUpdate(query, { atendido : true, usuario : uid }, {new : true});

        return ticket;
    }

    async ticketPendiente() {
        // buscar los tickets pendientes por atender
        const query = { 
            fecha : new Date().toISOString().slice(0, 10),
            atendido : false,
            usuario : null
        }

        const ticketsPendientes = await Ticket.countDocuments(query);
        return ticketsPendientes;
    }

    async ultimos4() {
        // buscar los ultimos 4 tickets atendidos
        const query = {
            atendido : true
        }

        const ultimos4Tickets = await Ticket.find(query).sort({_id:-1}).limit(4).populate('usuario', 'nombre');

        return ultimos4Tickets;
    }
}

module.exports = TicketControl;