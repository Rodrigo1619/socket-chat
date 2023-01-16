//Referencias HTML
const txtUid      = document.querySelector("#txtUid");
const txtMensajes = document.querySelector("#txtMensajes");
const ulUsuarios  = document.querySelector("#ulUsuarios");
const ulMensaje   = document.querySelector("#ulMensaje");
const btnSalir    = document.querySelector("#btnSalir");




//todo: se podria hacer en una variable global para no estar repitiendo este codigo 
const url =  (window.location.hostname.includes("localhost"))
                ? "http://localhost:8080/api/auth/"
                : "https://apicoffe.herokuapp.com/api/auth/"

//Variables globales que se usaran mas adelante
let usuario = null;
let socket = null;

//validar el token del localStorage
const validarJWT = async()=>{

    const token = localStorage.getItem('token') || '';

    if(token <= 10 ){
        window.location = 'index.html';
        return new Error('No hay token en el servidor mi rey');
    }
    const respuesta = await fetch(url, {
        headers: {'x-token': token}
    });

    //como ya tenemos un usuario en el global lo renombramos porque este es otro usuario el que queremos ver
    const {usuario: usuarioDB, token:tokenDB} = await respuesta.json();
    //renovar el jwt para darle mas tiempo a ese token
    localStorage.setItem('token', tokenDB);
    //si queremos saber informacion del usuario 
    usuario = usuarioDB;

    document.title = usuario.nombre
    //despues de ejecutar todo lo anterior y que este validado va a ejecutar la funcion
    await conectarSocket();
}

const conectarSocket = async()=>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });
    //los sockets que vamos a estar escuchando
    socket.on('connect', ()=>{
        console.log('Sockect online')
    })
    socket.on('disconnect', ()=>{
        console.log('socket offline')
    })
    socket.on('recibir-mensaje', ()=>{
        //todo
    })
    socket.on('usuarios-activos', (payload)=>{
        console.log(payload)
    })
    socket.on('mensaje-privado', ()=>{
        //todo
    })




}

const main = async()=>{

    await validarJWT();
}

//llamamos la funcion 
main();

