
import { Router } from "express";

const router = Router();

router.get("", (req, res) => {
    res.render("forgot", {
        title: "¿Olvidaste tu contrasena?",
    });
});

export default router;