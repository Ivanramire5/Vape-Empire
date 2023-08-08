import { Router } from "express";
import { __filename, __dirname } from "../utils.js";

const router = Router();

router.get("/", (solicitud, respuesta) => {
    respuesta.render("index", {Title: "Hello"});
});

export default router;