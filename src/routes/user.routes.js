
import { Router } from "express";
import { getAllUsers, saveUser } from "../controller/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/", saveUser);

export default router;