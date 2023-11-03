
import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, productsRealTime } from "../controller/productController.js";

const ProductsRoute = Router()

ProductsRoute.post('/', createProduct)
ProductsRoute.get('/', productsRealTime) /* (req, res) => {
    res.render("realtimeproducts")
})
*/

ProductsRoute.get('/api/', getProducts)
ProductsRoute.get('/:id', getProductById)
ProductsRoute.put('/:id', updateProduct)
ProductsRoute.delete('/:id', deleteProduct)

export default ProductsRoute