
import { Router } from "express"
import { 
    createOrder, 
    captureOrder, 
    cancelPayment 
} from "../controller/paymentController.js"

const paymentRoutes = Router()

paymentRoutes.post("/create-order", createOrder)

paymentRoutes.get("/capture-order", captureOrder)

paymentRoutes.get("/cancel-order", cancelPayment)

export default paymentRoutes;