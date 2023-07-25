import { Router } from "express";

import { __filename, __dirname } from "../utils.js";
import {
    obtenerListaDeProducts,
} from "../services/productUtils.js";

const realtimeRouter = Router();

realtimeRouter.get("/", (solicitud, respuesta) => {
    const products = obtenerListaDeProducts();

    respuesta.render("realtimeproducts", { products })
});

export default realtimeRouter;