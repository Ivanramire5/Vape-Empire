
import { Router } from "express";
import { showProducts, showRealTimeProducts, showCart } from "../controller/views.controller.js"
import { authAdmin } from "../utils";

const viewsRouter = Router()

viewsRouter.get("/", showProducts)

viewsRouter.get("/realTimeProducts", authAdmin, showRealTimeProducts)

viewsRouter.get("/carts/:cid", showCart)

export { viewsRouter }