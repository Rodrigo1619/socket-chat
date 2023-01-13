//Referencias de nuestro formulario
const miFormulario = document.querySelector('form');

//Nuestro url destinado para el localhost y proximamente en railway
 //TODO: cambiar de heroku a railway
const url =  (window.location.hostname.includes("localhost"))
                ? "http://localhost:8080/api/auth/"
                : "https://apicoffe.herokuapp.com/api/auth/"


//evitar que al presionar el boton recargue la pagina
miFormulario.addEventListener('submit', evento=>{
    evento.preventDefault(); 
    const formData = {};

    for(let elemento of miFormulario.elements){
        if(elemento.name.length > 0)
            formData[elemento.name] = elemento.value
    }
    fetch(url + '/login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            return console.error(msg);
        }
        localStorage.setItem('token', token);
    })
    .catch(err => {
        console.log(err)
    })
})

//Funcion para poder hacer el login de google
function handleCredentialResponse(response) {
    
    const data = { id_token: response.credential };

    fetch(url + 'google', { //se le concatena google para agregarlo al url que es de nuestro localhost y nuestro server en railway
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then((resp) => resp.json())
    .then(({token})=>{
        localStorage.setItem('token', token);
    })
    .catch(console.warn);
    }
    //haciendo el log out de la cuenta
    const button = document.getElementById("google_signout");
    button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload(); //para recargar el estado de nuestra pagina
    });

};//final de la funcion
