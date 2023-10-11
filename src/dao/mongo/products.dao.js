

import productModel from "./models/products.model.js"

class ProductMongooseDao{

    //Obtenemos los productos
    async getProducts(req,res) {
        const {limit = 10, page = 1, sort, query} = req.query
        const results = await productModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
        let prevLink = results.hasPrevPage ? `http://localhost:8080/productos/?page=${+page-1}&limit=${limit}&query=${query}&sort=${sort}` : null
        let nextLink = results.hasNextPage ? `http://localhost:8080/productos/?page=${+page+1}&limit=${limit}&query=${query}&sort=${sort}` : null
        results.prevLink = prevLink
        results.nextLink = nextLink
        return results
    }

    //Creamos los productos
    async createProduct(data) {
        const product = await productModel.create(data)

        return {
            id: product._id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail
        }
    }

    //Obtenemos el id de un producto
    async getProductsById(id) {
        const product = await productModel.findOne(id)

        return {
            id: product._id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail
        }
    }

    //Actualizamos el id de un producto
    async updateProduct(data, id){
        const product = await productModel.updateOne({ _id: id }, data)
        return product
    }

    //Eliminamos un producto
    async deleteProduct(id){
        return productModel.deleteOne({ _id: id})
    }
}

export default ProductMongooseDao