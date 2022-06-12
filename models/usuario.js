
const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es obligatorio']
    },
    correo : {
        type : String,
        required : [true, 'El correo es obligatorio'],
        unique: true
    },
    password : {
        type : String,
        required : [true, 'La contraseña es obligatoria']
    },
    rol : {
        type : String,
        required : true,
        default : 'USER_ROLE',
        emun : ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado : {
        type : Boolean,
        default : true
    }
});

usuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', usuarioSchema);
