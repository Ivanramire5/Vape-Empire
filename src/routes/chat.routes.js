
import { Router } from "express";


const ChatRouter = Router();

ChatRouter.get("/", (req, res) => {
    res.render("chat", {})
});

export default ChatRouter 