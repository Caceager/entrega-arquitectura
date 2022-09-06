const {logError} = require("../../server/utils/loggers");
const socketio = require("socket.io");
const {container: Container} = require("../productos");
const {mensajes: Mensajes} = require("../mensajes");

const container = new Container();
const mensajes = new Mensajes();

function setSocket(server) {
    const io = socketio(server);
    io.on('connection', (socket) =>{
        console.log('conexion');

        container.cargar_productos().then( (prods) =>{
            try{
                io.sockets.emit('productos', prods);
            }
            catch (e) {
                logError.error(e);
            }

        })

        mensajes.cargar_mensajes().then((mensaje) => {
            try {
                io.sockets.emit('mensajes', mensaje);
            }
            catch (e) {
                logError.error(e);
            }
        });

        socket.on('nuevo producto', (producto) =>{
            try {
                container.guardar_producto(producto).then( ()=>{
                    container.cargar_productos().then( (prods) =>{
                        io.sockets.emit('productos', prods);
                    })
                });
            }
            catch (e) {
                logError.error(e);
            }

        })

        socket.on('cargarMensajes', ()=>{
            try {
                mensajes.cargar_mensajes().then((mensaje) => {
                    io.sockets.emit('mensajes', mensaje);
                });
            }
            catch (e) {
                logError.error(e);
            }
        })

        socket.on('nuevo mensaje', (mensaje) =>{
            try {
                mensajes.guardar_mensajes(mensaje).then(() =>{
                    mensajes.cargar_mensajes().then((mens)=>{
                        io.sockets.emit('mensajes', mens);
                    });
                });
            }
            catch (e) {
                logError.error(e);
            }
        });
    });
}

module.exports = setSocket;