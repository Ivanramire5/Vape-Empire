import MessagesModel from "../dao/models/messages.model.js";
import { Router } from "express";

const router = Router()

router.get("/",(req,send)=>{
    send.render("chat",{title:"Chat"})
})

export default router