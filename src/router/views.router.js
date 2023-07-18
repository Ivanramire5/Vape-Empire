import { Router } from "express";
import { __filename, __dirname } from "../utils.js";
import { obtenerListaDeProductos } from "../services/productUtils.js";

const productRouter = Router();

productRouter.get("/", (solicitud, respuesta) => {
    const productos = obtenerListaDeProductos()

    respuesta.render("home", { productos });
});

export default productRouter;