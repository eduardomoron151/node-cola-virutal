const { response } = require("express");
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');


const usuariosPost = async(req, res = response) => {
    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({ nombre, correo, password, rol });

     // encriptar la contraseña 
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // guardar en base de datos
    await usuario.save();

    res.json(usuario);

}


module.exports = {
    usuariosPost
}