

import { Router } from "express";


const loginRouter = Router();

loginRouter.get("/", (req, res) => {
    res.render("login", {
        title: "Inicia sesion",
    });
});

export { loginRouter }