import ProductRepository from "../dao/mongo/ProductMongooseDao.js"
import CustomError from "../services/errors/CustomErrors.js"
import EErrors from "../services/errors/enums.js"
import { generateProductErrorInfo } from "../services/errors/info.js"


// Crear products
export const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, status, stock, thumbnail } = req.body
        const product = {
            title,
            description,
            code,
            price,
            status,
            stock,
            thumbnail
        }
        if (!title || !description || !code) {
            CustomError.createError({
                name: 'User creation error',
                cause: generateProductErrorInfo({ title, description, code }),
                message: 'Error in create User',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        const manager = new ProductRepository()
        const result = await manager.createProduct(product)

        res.send({ status: 'sucess', result, message: 'Product created.' })
    } catch (error) {
        req.logger.error('Error in createProduct: ' + error.message)
        req.logger.error(error.stack)
        res.status(500).json({ error: 'Internal server error '})
        //console.log('Erorr in created products' + error)
    }
}
export const productsRealTime = async (req, res) => {
    try {
        const manager = new ProductRepository()
        const { limit, sort, category, page } = req.query
        const products = await manager.getProducts(+limit, sort, category, +page)
        console.log("referencia", products)
        res.render("realtimeproducts", {products: products})
    } catch (error) {
        console.log('Erorr en todos los productos' + error) //Error acá
    }
}
// Obtener todos los productos
export const getProducts = async (req, res, next) => {
    try {
        const manager = new ProductRepository()
        const { limit, sort, category, page } = req.query
        const products = await manager.getProducts(+limit, sort, category, +page)
        console.log(products)
        res.send({ status: 'sucess', products })
    } catch (error) {
        console.log('Erorr en todos los productos' + error) //Error acá
    }
}

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const manager = new ProductRepository()
        const productId = await manager.getProductById(id)
        res.send({ status: 'sucess', productId })
    } catch (error) {
        console.log('Error in getProductById' + error)
    }
}

// Obtener producto por ID y actualizar informacion
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const manager = new ProductRepository()
        const updatedProduct = await manager.updateProduct(id, data)
        res.send({ status: 'sucess', updatedProduct, message: 'Product updated.' })
    } catch (error) {
        console.log('Error in updatedProductById' + error)
    }
}

// Borrar producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const manager = new ProductRepository()
        const product = await manager.deleteProduct(id)
        res.send({ status: 'sucess', product, message: 'Product deleted.' })
    } catch (error) {
        console.log('Erorr in deleteProductById' + error)
    }
}