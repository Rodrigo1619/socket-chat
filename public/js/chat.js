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
    socket.on('recibir-mensajes', dibujarMensajes)
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload)=>{
        console.log('privado:', payload)
    })
}

//funcion para mostrar los usuarios en el html
const dibujarUsuarios = (usuarios = [])=>{
    let usersHtml = '';
    usuarios.forEach(({nombre, uid}) =>{
        usersHtml += `
        <li> 
            <p>
                <h5 class="text-success"> ${nombre} </h5>
                <span class="fs-6 text-muted"> ${uid}</span> 
            </p>
        </li>
        
        `
    });
    ulUsuarios.innerHTML = usersHtml;
}

//funcion para mostrar los mensajes en el html
const dibujarMensajes = (mensajes = [])=>{
    let mensajesHtml = '';
    mensajes.forEach(({nombre, mensaje}) =>{
        mensajesHtml += `
        <li> 
            <p>
                <span class="text-primary"> ${nombre}:  </span>
                <span> ${mensaje}</span> 
            </p>
        </li>
        
        `
    });
    ulMensaje.innerHTML = mensajesHtml;
}

//para los mensajes a mandar
txtMensajes.addEventListener('keyup', ({keyCode})=>{  //el keycode 13 es el de enter, trabajaremos con eso
    const mensaje = txtMensajes.value;
    const uid = txtUid.value;

    if(keyCode !== 13){return;}
    if(keyCode.length === 0){return;}

    //emitimos el mensaje para que nuestro backend lo reciba
    socket.emit('enviar-mensaje', {mensaje, uid});
    //limpiamos para que cuando se mande el mensaje desaparezca del escritor
    txtMensajes.value = '';
})




const main = async()=>{

    await validarJWT();
}

//llamamos la funcion 
main();

