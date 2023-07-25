import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
import { obtenerListaDeProducts } from "../services/productUtils.js";

const productRouter = Router();

productRouter.get("/", (solicitud, respuesta) => {
    const products = obtenerListaDeProducts()

    respuesta.render("home", { products });
});

export default productRouter;