
import { Router } from "express";
import passport from "passport";

const router = Router()



router.post("/signup", async (req, res) => {
    console.log(req.body)
    const usuarios = await userModel.create([req.body])
    return res.status(201).JSON({message: "Producto agregado exitosamente", data : result})
})
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
        res.redirect("/");
    }
);
export default router