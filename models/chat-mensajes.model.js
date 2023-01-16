//clase para mostrar como se veran los mensajes
class Mensaje{
    constructor(uid, nombre, mensaje){
        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes{
    constructor(){
        this.mensajes = [];
        this.usuarios = {}; 
    }
    //getter:metodo como en c# para obtener los ultimos 10 mensajes
    get ultimos10(){
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }
    //devolver los usuarios como un arreglo de objetos
    get usuariosArr(){
        return Object.values(this.usuarios); //[{}, {}, {}]
    }
    //para enviar un mensaje
    enviarMensaje(uid, nombre, mensaje){
        //para ir insertando los mensajes al inicio
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        )
    }
    conectarUsuario(usuario){
        this.usuarios[usuario.id] = usuario
    }
    //borramos el usuario cuyo se desconecte del servidor que tenga su id
    desconectarUsuario(id){
        delete this.usuarios[id]

    }
}
module.exports = ChatMensajes;