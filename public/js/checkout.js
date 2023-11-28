
const checkout = document.getElementById("checkout");
checkout.addEventListener("click", async () => {
    const response = await fetch("/create-order", {
        method: "POST",
    });
    const data = await response.json();
    window.location.href = data.links[1].href
    }
);