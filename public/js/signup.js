
const form = document.getElementById("signupForm");
const loc = window.location.href.split(":");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;
    let password = document.getElementById("password").value;
    signup(first_name, last_name, email, age, password).then(data => console.log(data));
});

const signup = async (first_name, last_name, email,age, password) => {
    console.log(JSON.stringify({first_name, last_name, email, age, password}))
    const response = await fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ first_name, last_name, email, age, password }) // Corrección aquí
    });
    const data = await response.json(); // Se agrega el await aquí
    if(data.status === "success"){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registrado con exito!',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(()=>{
            window.location.href = loc[0]+":"+loc[1]+":"+loc[2].split("/")[0]
        },2000)
    }
    return data;
};
