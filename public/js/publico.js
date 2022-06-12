// Referencias HTML
const lblTicket1 = document.querySelector('#lblTicket1')
const lblEscritorio1 = document.querySelector('#lblEscritorio1')
const lblTicket2 = document.querySelector('#lblTicket2')
const lblEscritorio2 = document.querySelector('#lblEscritorio2')
const lblTicket3 = document.querySelector('#lblTicket3')
const lblEscritorio3 = document.querySelector('#lblEscritorio3')
const lblTicket4 = document.querySelector('#lblTicket4')
const lblEscritorio4 = document.querySelector('#lblEscritorio4')

const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth'
: 'https://node-cola-virutal.herokuapp.com/api/auth';

let usuario = null;

const validarJWT = async() => {

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

    socket.on('estado-actual', (payload) => {
        const [ticket4, ticket3, ticket2, ticket1 ] = payload;

        console.log(ticket1);

        if(ticket1) {
            lblTicket1.innerText = 'Ticket ' + ticket1.numero + ' Cedula : ' + ticket1.cedula;
            lblEscritorio1.innerText = 'Taquilla Nombre : ' + ticket1.usuario.nombre;
        }
    
        if(ticket2) {
            lblTicket2.innerText = 'Ticket ' + ticket2.numero + ' Cedula : ' + ticket2.cedula;
            lblEscritorio2.innerText = 'Taquilla Nombre : ' + ticket2.usuario.nombre;
        }
    
        if(ticket3) {
            lblTicket3.innerText = 'Ticket ' + ticket3.numero + ' Cedula : ' + ticket3.cedula;
            lblEscritorio3.innerText = 'Taquilla Nombre : ' + ticket3.usuario.nombre;
        
        }
    
        if(ticket4) {
            lblTicket4.innerText = 'Ticket ' + ticket4.numero + ' Cedula : ' + ticket4.cedula;
            lblEscritorio4.innerText = 'Taquilla Nombre : ' + ticket3.usuario.nombre;
        }
    })

}


const main = async() => {

    await validarJWT()

}

main();
