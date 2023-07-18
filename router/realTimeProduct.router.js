import { Router } from "express";

import { __filename, __dirname } from "../utils.js";
import {
    obtenerListaDeProductos,
    guardarProducto,
} from "../services/productUtils.js";

const realtimeRouter = Router();

realtimeRouter.get("/", (solicitud, respuesta) => {
    const productos = obtenerListaDeProductos();

    respuesta.render("realtimeproducts", { productos })
});

export default realtimeRouter;