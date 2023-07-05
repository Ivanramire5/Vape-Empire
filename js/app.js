import express from "express";
import { ProductManager } from "./ProductManager.js";

const app = express();
const PORT = 4000;
const productManager = new ProductManager('./productosVapeo.json')
let productos = [];

app.get("/", (solicitud, respuesta) => {
    respuesta.send('<h1 style="color: blue">Bienvenido a Vape Empire</h1>');
});

app.get("/productos", async (solicitud, respuesta) => {
    const { limit } = solicitud.query;
    try {
        let response = await productManager.getProducts();
        if (limit) {
            let temporalArray = response.filter((dat, index) => index < limit);
            respuesta.json({data: temporalArray, limit: limit, quantity: temporalArray.length });
        } else {
            respuesta.json({ data: response, limit: false, quantity: response.length });
        }
    } catch (err) {
        console.log(err)
    }
})
app.get("/productos/:pid", async (solicitud, respuesta) => {
    const { pid } = solicitud.params;

    let product = await productManager.getProductsById(pid);

    if (product) {
        respuesta.json({ message: "success", data: product })
    } else {
        respuesta.json({
            message: "El producto que usted busca no existe"
        })
    }
})
app.listen(PORT, () => {
    console.log("Running on port" + PORT)
});