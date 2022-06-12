const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');
const txtCedula = document.querySelector('#txtCedula');

const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth'
: 'https://node-cola-virutal.herokuapp.com/api/auth';

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

    socket.on('ultimo-ticket', (ultimo) => {
        lblNuevoTicket.innerText = 'Ticket ' + ultimo;
    })

    btnCrear.addEventListener('click', (e) => {
        e.preventDefault();
        if(txtCedula.value.length < 4) {
            Swal.fire(
                'Advertencia',
                'Debe enviar una cedula valida',
                'warning'
            );
            return;
        }

        const data = {
            cedula : txtCedula.value
        }
        
        socket.emit('siguiente-ticket', data, (ticket) => {

            if(ticket.msg) {
                Swal.fire(
                    'Advertencia',
                    ticket.msg,
                    'warning'
                );
                return;
            }

            lblNuevoTicket.innerText = 'Ticket ' + ticket.numero;
            Swal.fire(
                'Ticket Creado',
                `Nro. ${ticket.numero}, cedula : ${data.cedula}`,
                'success'
            );
            txtCedula.value = '';
        });

    })
}


const main = async() => {

    await validarJWT()

}

main();

