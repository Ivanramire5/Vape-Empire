import { Router } from "express";
import CartManager from "../classes/cartManager.js"
import ProductManager from "../classes/ProductManager.js";

const router = Router();

let carrito = new CartManager("./src/datos/cart.json");
let productos = new ProductManager("./src/datos/productosVapeo.json");

router.post("/", async (solicitud, respuesta) => {
    try {
        await carrito.addCart();
        respuesta.send({ status: "Success", message: "Cart created "})
    } catch (error) {
        respuesta.status(400).send({ status: "Error", error: "Error al crear un carrito"})
    }
})

.get("/:cid", async (solicitud, respuesta) => {
    try {
        let { cid } = solicitud.params;
        let cart = await carrito.getCartById(parseInt(cid))
        respuesta.send({ cart })
    } catch (error) {
        respuesta.status(400).send({ status: "Error", error: "Cart not founded" })
    }
})

.post("/:cid/products/:pid", async (solicitud, respuesta) => {
    try {
        let product = await productos.getProductById(parseInt(solicitud.params.pid));
        await carrito.addProductToCart(solicitud.params.cid, product.id);
        respuesta.send({ status: "Success", message: "Producto agregado con exito" })
    } catch (error) {
        respuesta(400).send({ status: "Error", error: "Error al cargar el producto"})
    }
})

export default router;