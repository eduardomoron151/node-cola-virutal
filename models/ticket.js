
const { Schema, model } = require('mongoose');

const ticketSchema = Schema({
    numero : {
        type : Number,
        required : [true, 'El numero es obligatorio']
    },
    atendido : {
        type : Boolean,
        default : false,
        required : true,
    },
    cedula : {
        type : Number,
    },
    fecha : {
        type : Date,
        required : true
    },
    usuario : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario'
    }
});

// ticketSchema.methods.toJSON = function() {
//     const { __v, password, _id, ...ticket} = this.toObject();
//     ticket.uid = _id;
//     return ticket;
// }

module.exports = model('Ticket', ticketSchema);
