

//todo: se podria hacer en una variable global para no estar repitiendo este codigo 
const url =  (window.location.hostname.includes("localhost"))
                ? "http://localhost:8080/api/auth/"
                : "https://apicoffe.herokuapp.com/api/auth/"

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
}

const main = async()=>{

    await validarJWT();
}

//llamamos la funcion 
main();


//const socket = io();