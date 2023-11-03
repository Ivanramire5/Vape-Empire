
import { Router } from "express";
import { addProductInCart, getAllCarts, createCart, deleteCart, deleteProductInCart, getCartById, updateCart, updateQuantity } from "../controller/cartController.js";


const CarritoRoute = Router()

CarritoRoute.post('/', createCart)
CarritoRoute.get('/', getAllCarts)
CarritoRoute.get('/:uid', getCartById)
CarritoRoute.delete('/:uid', deleteCart)
CarritoRoute.post('/:cid/products/:pid', addProductInCart)
CarritoRoute.delete('/:cid/products/:pid', deleteProductInCart)
CarritoRoute.put('/:cid/products/:pid', updateQuantity)
CarritoRoute.put('/:cid', updateCart)


export default CarritoRoute