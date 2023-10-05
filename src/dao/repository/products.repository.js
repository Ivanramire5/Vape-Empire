
//Importamos los datos de productos
import { ProductsDTO } from "../DTO/products.dto.js"

//Importalos ProductsDTO para transmitir datos
export class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getProducts(req, res) {
        return await this.dao.getProducts(req, res)
    } //Obtenemos los productos

    async getProductsById(id) {
        return await this.dao.getProductsById(id)
    } //Obtenemos el id de cada producto

    async saveProduct(product) {
        const productDto = new ProductsDTO(product)
        return await this.dao.saveProduct(productDto)
    } //Guardamos los nuevos productos

    async modifyProduct(pid, product) {
        const productDto = new ProductsDTO(product)
        productDto._id = !isNaN(pid) ? +pid : pid
        return await this.dao.modifyProduct(pid, productDto)
    } //Modificamos los productos ya existentes

    async deleteProduct(pid) {
        return await this.dao.deleteProduct(pid)
    } //Borramos un producto

    async modifyStockProduct(pid) {
        return await this.dao.modifyProduct(pid)
    } //Modificamos el stock de ciertos productos
}