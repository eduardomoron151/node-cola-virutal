
let usuario = null;

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

    if(usuario.rol === 'USER_ROLE') {
        window.location = 'escritorio.html'
    }

}


const main = async() => {

    await validarJWT()

}

main();

