
let form = document.getElementById("loginForm");
console.log(form);
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let mail = document.getElementById("mail").value;
    let password = document.getElementById("password").value;
    console.log(mail, password);
    await loguearse(mail, password);
});

const loguearse = async (mail, password) => {
    const response = await fetch("/login", {
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
            window.location.href = "http://localhost:3000/views";
        }, 2000);
    } else {
        Swal.fire(
            'Usuario incorrecto',
            'Reintentelo otra vez',
            'error'
        );
    }
};
