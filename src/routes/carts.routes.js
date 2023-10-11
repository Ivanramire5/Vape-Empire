
import { Router } from "express";
import cartManager from "../memory/carrito.controller.js";


//Iniciamos router
const CarritoRoute = Router()
const carts = new cartManager();

//Crear carrito
CarritoRoute.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        let allCarts = await carts.getCarts();
        if (limit) {
            let temp = allCarts.filter((dat, index) => index < limit);
            res.json({ dat: temp, limit: limit, quantity: temp.length });
        } else {
            res.json(allCarts);
        }
    } catch (err) {
        console.log(err);
    }
});

CarritoRoute.post("/newCart", async (req, res) => {
    try {
        let cart = await carts.newCart();
        res.json({ message: "carrito creado", cart });
    } catch (err) {
        console.log(err);
    }
})

//Usamos el id para el carrito
CarritoRoute.get("/:id",async (req, res) => {
    let idParam = req.params.id;
    try {
        let cart = await carts.getCartsById(idParam);
        if (!cart) {
            res.status(404).json({ error: "carrito no encontrado" });
        } else {
            res.json(cart);
        }
    } catch (err) {
        console.log(err);
    }
})

//Usamos el id para el carrito y le agregamos un producto
CarritoRoute.post("/:cid/product/:pcode", async (req, res) => {
    const { cid, pcode } = req.params;
    try {
        let cart = await carts.getCartsById(cid);
        if (!cart) {
        res.status(404).json({ error: "carrito no encontrado" });
        } else {
        let result = await carts.addProductToCart(cid, parseInt(pcode));
        res.json({ message: "producto agregado", result });
        }
    } catch (err) {
        console.log(err);
    }
})

//Eliminamos todos los productos del carrito
CarritoRoute.delete("/:id", async (req, res) => {
    let cart = await carts.deleteCart(req.params.id);
    res.json({ message: "carrito eliminado", cart });
    });
    CarritoRoute.put("/", async (req, res) => {
        try {
    } catch (error) {}
});



export default CarritoRoute 