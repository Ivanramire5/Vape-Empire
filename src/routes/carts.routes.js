
import { Router } from "express";
import { createCart, getCartById, saveProductInCart, updateCart, updateQuantityProductInCart, deleteProductInCart, purchaseProducts } from "../controller/carrito.controller.js"

//Iniciamos router
const CarritoRoute = Router()

//Crear carrito
CarritoRoute.post("/", createCart)

//Usamos el id para el carrito
CarritoRoute.get("/:cid", getCartById)

//Usamos el id para el carrito y le agregamos un producto
CarritoRoute.post("/:cid/product/:pid", saveProductInCart)

//Eliminamos del carrito un producto
CarritoRoute.delete("/:cid/products/:pid", deleteProductInCart)

//Actualizamos el carrito
CarritoRoute.put("/:cid", updateCart)

//Actualizamos la cantidad de productos en el carrito
CarritoRoute.put("/:cid/products/:pid", updateQuantityProductInCart)

//Eliminamos todos los productos del carrito
CarritoRoute.delete("/:cid", deleteProductInCart)

//Comprar productos en el carrito
CarritoRoute.post("/:cid/purchase", purchaseProducts)

export { CarritoRoute }