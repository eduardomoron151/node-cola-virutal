const { Router } = require('express');
const { check } = require('express-validator');


const { usuariosPost } = require('../controllers/usuarios.controller');

const { existeCorreo } = require('../helpers/db-validaciones');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [
    check('nombre', 'El nombre es de caracter obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mayor de 6 caracteres').isLength({ min : 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeCorreo),
    validarCampos
], usuariosPost)

module.exports = router;