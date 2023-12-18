const socket = io();

const chatbox = document.querySelector("#chatbox")
let user;

Swal.fire({
    title: "Bienvenido",
    text: "Ingrese su nombre para continuar",
    input: "text",
    inputValidator: (value) =>{
        return !value && "Necesitas indentificarte";
    },

    allowOutsideClick: false   //esto es para que no pueda hacer click afuera del recuadro y saltearse la validacion


    //pero hay que devolver una promesa porque si no no hace nada
}) .then((value) => {
    user = value.value;
    socket.emit("inicio", user);
    //console.log(user);
});

chatbox.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter') {
        socket.emit("message", {
            user,
            message: e.target.value,
        });
       chatbox.value = "";   ///vacia desp la cajita para poder seguir ingresando data
    }
});

//adicional activ
socket.on("connected", (data) =>{
    if (user !== undefined){
        swal.fire({
            text: `Nuevo usuario conectado ${data}`,
            toast: true,
            position: "top-right",
        });
    }
});


socket.on("messages", (data) => {
    const log = document.querySelector("#messages")
    let messages ="";

    data.forEach ((message) =>{
        messages += `<strong> ${message.user}</strong>: ${message.message} <br />`
    });

    log.innerHTML = messages;
    console.log(data);
})