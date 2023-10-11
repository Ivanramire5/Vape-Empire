
import ProductMongooseDao from "../mongo/products.dao.js"

class ProductRepository {
    constructor() {
        this.productDao = new ProductMongooseDao()
    }

    async getProducts(limit, sort, category, page) {
        let aggregationStages = []
        
        let pagination = {
            limit: limit,
            category: category,
            page: page ? page : 1
        }

        if (category) {
            aggregationStages.push({ $match: { category } })
        }

        if (limit) {
            aggregationStages.push({ $limit: limit })
        } else {
            aggregationStages.push({ $limit: 10 })
        }

        if (sort === 'asc') {
            aggregationStages.push({ $sort: { price: 1 } })
        }

        if (sort === 'desc') {
            aggregationStages.push({ $sort: { price: -1 } })
        }

        return this.productDao.getProducts(aggregationStages, pagination)
    }

    async createProduct(data) {
        return this.productDao.createProduct(data)
    }

    async getProductById(id) {
        return this.productDao.getProductById(id)
    }

    async updateProduct(id, data) {
        return this.productDao.updateProduct(id, data)
    }

    async deleteProduct(id) {
        return this.productDao.deleteProduct(id)
    }
}


export default ProductRepository