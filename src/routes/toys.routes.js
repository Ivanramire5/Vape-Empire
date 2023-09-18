
import { Router } from "express";
import { saveToy, getAllToys } from "../controller/toys.controller.js";

const router = Router();

router.get("/", getAllToys);
router.post("/", saveToy);

export default router;