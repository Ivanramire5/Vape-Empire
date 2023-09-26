
import { Router } from "express";
import passport from "passport";
import { UserModel } from "../dao/mongo/models/users.model.js"
import { createHash, isValidPassword } from "../utils.js"

const router = Router();

function auth(req, res, next) {
    if (req.session?.user && req.session?.admin) {
        return next()
    }
    return res.status(401).json("Error de autenticacion");
}

router.post(
    "/login",
    passport.authenticate("login", {
        failureRedirect: "/failLogin",
    }),
    async (req, res) => {
        console.log(req.user);
        if (!req.user) {
            return res.status(401).json("error de autenticacion")
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
        };
        req.session.admin = true;
        res.send({ status: "success", mesage: "user logged", user: req.user });
    }
);

router.get("/failLogin", async (req, res) => {
    console.log("Failed login");
    res.send({ error: "failed" });
});

router.post("/forgot", async (req, res) => {
    const { username, newPassword } = req.body;

    const result = await UserModel.find({
        email: username,
    });
    if(result.length === 0)
    return res.status(401).json({
        respuesta: "El usuario no existe",
    });
    else {
        const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
            password: createHash(newPassword),
        });
        console.log(respuesta);
        res.status(200).json({
            respuesta: "Se cambió la contraseña",
            datos: respuesta,
        });
    }
});

router.get("/privado", auth, (req, res) => {
    res.render("topsecret", {});
});

router.post(
    "/signup",
    passport.authenticate("register", {
        failureRedirect: "/failRegister",
    }),
    async (req, res) => {
        res.send({ status: "success", mesage: "user registered" });
    }
);
router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);
router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
      req.session.user = req.user;
      req.session.admin = true;
      res.redirect("/");
    }
  );
router.get("/failRegister", async (req, res) => {
    console.log("failed strategy");
    res.send({ error: "failed" });
});

export default router