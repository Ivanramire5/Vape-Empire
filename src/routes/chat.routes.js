
import { Router } from "express";
import { getMessages } from "../controller/chat.controller.js"

const ChatRoute = Router()

ChatRoute.get("/", getMessages)

export { ChatRoute }