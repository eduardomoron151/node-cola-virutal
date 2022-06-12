const express = require('express');
const cors    = require('cors');
const { createServer } = require('http');

const { dbConexion } = require('../database/config');
const { socketController } = require('../sockets/controller');



class Server {

    constructor() {

        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths  = {
            auth : '/api/auth',
            usuarios : '/api/usuarios'
        }

        // Conexion a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // sockets
        this.sockets();

    }

    async conectarDB() {
        await dbConexion()
    }

    middlewares() {

        // cors
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use(express.json());

        // Public
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        })
    }
}



module.exports = Server