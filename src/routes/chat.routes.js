import MessagesModel from "../dao/models/messages.model.js";
import { Router } from "express";

const router = Router()

router.get("/",(solicitud,respuesta)=>{
    respuesta.render("chat",{title:"Chat"})
})

export default router