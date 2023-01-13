const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");

const socketController = async(socket = new Socket())=>{
    //console.log('Cliente conectado', socket.id)
    const token = socket.handshake.headers['x-token'];
    const usuario =  await comprobarJWT(token);
    if(!usuario){
        return socket.disconnect();
    }

    console.log('se conecto', usuario.nombre)

}
module.exports = {
    socketController
}