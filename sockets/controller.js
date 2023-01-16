const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

//instanciamos nuestra clase para poder ver la propiedad de los usuarios activos
const chatMensajes = new ChatMensajes();

//recibe el io porque es la referencia de todo nuestro servidor, ahora se cambia una parte del modelo de server
const socketController = async(socket = new Socket(), io)=>{
    //console.log('Cliente conectado', socket.id)
    const token = socket.handshake.headers['x-token'];
    const usuario =  await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect();
    }
    //console.log('se conecto', usuario.nombre)

    //Agregamos al usuario conectado
    chatMensajes.conectarUsuario(usuario);

    //ya no es broadcast porque ahora el io hace esa funcion por como se ha declarado y solo basta con el emit
    io.emit('usuarios-activos', chatMensajes.usuariosArr ) //mandamos los usuarios conectados pero los que metimos al arreglo de objetos

    //limpiando cuando un usuario se desconecta
    socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); //emitimos a todos que ese usuario se desconecto
    })


}
module.exports = {
    socketController
}