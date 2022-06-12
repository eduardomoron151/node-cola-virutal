const Usuario  = require('../models/usuario');

const existeCorreo = async(correo = '') => {
    // Verificar si el correo existe
    const existe = await Usuario.findOne({ correo });
    if(existe) throw new Error(`El correo ${correo} ya se encuentra registrado`);
}


module.exports = {
    existeCorreo
}