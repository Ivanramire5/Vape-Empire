
const socket = io();

let chatBox = document.getElementById("chatBox");
console.log("prueba de chatBox");

let user;
Swal.fire({
    title: 'Ingresa tu nombre',
    input: 'text',
    text: "Ingresa tu nombre de usuario",
    allowOutsideClick: false,
    confirmButtonText: "Aceptar",
    inputValidator: (value) => {
        if (!value) {
            return "Debes ingresar un nombre de usuario";
        }
    }
}).then((result) => {
    if (result.value) {
        user = result.value;
        socket.emit("new-user", { user: user, id: socket.id})
    }
});

//chatbox

chatBox.addEventListener("keyup", (e) => {
    if (e.key==="Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user: user,
                message: chatBox.value,
            })
            chatBox.value = "";
        }
    }
});
socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach((message) => {
        messages = messages + `${message.user} dice: ${message.message} <br>` 
    });
    log.innerHTML = messages;
})
socket.on("new-user-connected", (data) => {
    if (data.id !== socket.id)
        Swal.fire({
            text: `${data.user} se ha conectado al chat`,
            toast: true,
            position: "top-end",
    });
});

//finalizamos chatbox