
import { Router } from "express";
import __dirname from "../utils.js";

import Message from "../dao/mongo/models/chat.models.js";
import productManager from "../controller/products.controller.js";
import cartManager from "../controller/carrito.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJWT.js";

const product = new productManager();
const cart = new cartManager();
let ViewsRoute = Router();

ViewsRoute.get("/newproduct", [verifyToken, isAdmin], async (req, res) => {
const products = await product.getProducts();
//console.log(products);
    res.render("newProduct", { products });
});

ViewsRoute.get("/chat", async (req, res) => {
    const messages = await Message.find().sort("-createdAt"); // Recupera los mensajes de la base de datos
    res.render("chat", { messages });
});

ViewsRoute.get("/contact", async (req, res) => {
    res.render("contacto", {});
});

ViewsRoute.get("/login", async (req, res) => {
        res.render("login", {
        title: "Iniciar Sesion",
    });
});

ViewsRoute.get("/cart/:id", async (req, res) => {
    const cartId = req.params.id;
    const carts = await cart.getCartsById(cartId);
    console.log(carts);
    res.render("carts", {
        title: "Carrito de compras",
        carts,
    });
});

ViewsRoute.get("/", (req, res) => {
    res.render("signup", {
    title: "Crea tu cuenta",
    });
});

ViewsRoute.get("/forgotpassword", (req, res) => {
    res.render("forgotPassword", {
    title: "Recupera tu contraseña",
    });
});

export default ViewsRoute;