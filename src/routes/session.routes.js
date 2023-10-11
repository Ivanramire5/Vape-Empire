
import { Router } from "express";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import * as authControler from "../memory/session.controller.js"
import userModel from "../dao/mongo/models/users.model.js";




//Iniciamos el router
const SessionRoute = Router()

//login
SessionRoute.get("/login", authControler.login)

//signup
SessionRoute.get("/signup", authControler.signup)

//Github
SessionRoute.get(
    "/github",
    passport.authenticate("github", { scope: ["user:username"] }),
    async (req, res) => {}
);
  //en caso de que falle el login con GitHub
SessionRoute.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        req.session.user = req.user;
        req.session.admin = true;
        res.redirect("/");
    }
);

export default SessionRoute;