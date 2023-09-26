
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", (e) => {
        console.log(form);
        e.preventDefault();
        let first_name = document.getElementById("first_name").value;
        let last_name = document.getElementById("last_name").value;
        let mail = document.getElementById("mail").value;
        let user = document.getElementById("user").value;
        let password = document.getElementById("password").value;
        signup(first_name, last_name, mail, user, password).then(data => console.log(data));
    });

    const signup = async (first_name, last_name, mail, user, password) => {
        console.log(JSON.stringify({first_name, last_name, mail, user, password}))
        const response = await fetch("/api/sessions/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ first_name, last_name, mail, user, password }) // Corrección aquí
        });
        const data = await response.json(); // Se agrega el await aquí
        return data;
    };
})