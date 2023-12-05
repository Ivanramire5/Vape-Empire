import { Router } from "express";
import { captureOrder, cancelOrder } from "../controller/paymentController.js";

const paymentRoutes = Router()

paymentRoutes.get("/capture-order",captureOrder)
paymentRoutes.get("/cancel-order",cancelOrder)

export default paymentRoutes