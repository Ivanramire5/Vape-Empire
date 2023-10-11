
let form = document.getElementById("loginForm");

const loc = window.location.href.split(":")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let mail = document.getElementById("mail").value;
    let password = document.getElementById("password").value;
    console.log(mail, password);
    loguearse(mail, password);
});

const loguearse = async (mail, password) => {
    const response = await fetch("/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mail, password })
    });
    const data = await response.json();
    console.log(data);
    if (data.status === "OK") {
        Swal.fire(
            "Usuario ingresado correctamente",
            "Ya puede ingresar a la pagina",
            "success"
        )
        setTimeout(() => {
            window.location.href =  loc[0]+":"+loc[1]+":"+loc[2].split("/")[0]+"/views";
        }, 2000);
    } else {
        Swal.fire(
            'Usuario incorrecto',
            'Reintentelo otra vez',
            'error'
        );
    }
};
