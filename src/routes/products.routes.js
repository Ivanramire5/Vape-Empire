
import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controller/productController.js";

const ProductsRoute = Router()

ProductsRoute.post('/', createProduct)
ProductsRoute.get('/', getProducts)
ProductsRoute.get('/:id', getProductById)
ProductsRoute.put('/:id', updateProduct)
ProductsRoute.delete('/:id', deleteProduct)

export default ProductsRoute