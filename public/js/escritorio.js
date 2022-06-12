const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes')

const url = 'http://localhost:8080/api/auth';
let usuario = null;

const validarJWT = async() => {
    divAlerta.style.display = 'none';

    const token = localStorage.getItem('token-cola') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers : { 'x-token' : token}
    });

    const { usuario: userDB, token : tokenDB } = await resp.json();

    // renovar jwt
    localStorage.setItem('token-cola', tokenDB);

    // informacion del usuario
    usuario = userDB;

    document.title = usuario.nombre;
    lblEscritorio.innerText = 'Usuario: ' + usuario.nombre;

    await conectarSocket();

}


const conectarSocket = async() => {
    const socket = io({
        'extraHeaders' : {
            'x-token' : localStorage.getItem('token-cola')
        }
    });

    socket.on('connect', () => {
        console.log('sockets online');
    });

    socket.on('tickets-pendientes', (ticketPendiente) => {
        if(ticketPendiente === 0) {
            lblPendientes.style.display = 'none';
            divAlerta.style.display = ''
        } else {
            lblPendientes.style.display = '';
            lblPendientes.innerText = ticketPendiente;
        }
    });

    btnAtender.addEventListener('click', (e) => {
        e.preventDefault();

        socket.emit('atender-ticket', usuario, (payload) => {

            if(!payload) { return; }

            lblTicket.innerText = `Ticket ${payload.numero}, Cedula ${payload.cedula}`

        });
    })


}


const main = async() => {

    await validarJWT()

}

main();
