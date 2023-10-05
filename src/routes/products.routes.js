
import { Router } from "express";
import { getProducts, getProductById, saveProduct, modifyProduct, deleteProduct, modifyStockProduct } from "../controller/products.controller.js"

const ProductsRoute = Router()

//Tomamos los productos
ProductsRoute.get("/", getProducts)

//Tomamos un producto individual usando el id
ProductsRoute.get("/:pid", getProductById)

//Agregamos un producto y lo guardamos
ProductsRoute.post("/", saveProduct)

//Modificamos un producto
ProductsRoute.put("/:pid", modifyProduct)

//Borramos un producto
ProductsRoute.delete("/:pid", deleteProduct)

//Modificamos el stock de un producto
ProductsRoute.put("/stock/:pid", modifyStockProduct)

export {ProductsRoute}