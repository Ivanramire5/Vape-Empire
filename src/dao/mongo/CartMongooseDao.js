
import cartSchema from "./models/cartSchema.js"

export class CartMongooseDao {

    //Creamos el carrito
    async createCart() {
        return await cartSchema.create({ products: [] })
    }

    //Obtenemos el carrito
    async getCartById(id) {
        const cart = await cartSchema.findOne({ _id: id})
        return cart
    }

    async getAllCarts() {
        const cart = await cartSchema.find()
        return cart
    }
    //Eliminamos el carrito
    async deleteCart(id) {
        return await cartSchema.deleteOne({ _id: id})
    }

    //Añadimos un producto al carrito
    async addProductInCart(cartId, cart) {
        return await cartSchema.updateOne({ _id: cartId }, cart)
    }

    //Eliminamos un producto en un carrito
    async  deleteProductInCart(cartId, newCart) {
        return await cartSchema.findOneAndUpdate({ _id: cartId }, newCart)
    }

    //Actualizamos todo el carrito
    async updateCart(cartId, updateCart) {
        return await cartSchema.updateOne({ _id: cartId }, updateCart)
    }

    //actualizamos la cantidad de un producto dentro del carrito
    async updateQuantity(cartId, cart) {
        return await cartSchema.findOneAndUpdate({ _id: cartId }, cart)
    }
}

export default CartMongooseDao