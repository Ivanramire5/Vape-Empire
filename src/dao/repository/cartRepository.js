import CartMongooseDao from "../../dao/mongo/CartMongooseDao.js"
import {ProductsMongooseDao} from "../../dao/mongo/ProductMongooseDao.js"


class CartRepository {
    constructor() {
        this.cartDao = new CartMongooseDao()
        this.productDao = new ProductsMongooseDao()
    }
    // Crear carrito 
    async createCart() {
        return this.cartDao.createCart()
    }

    // Obtener carrito 
    async getCartById(id) {
        return this.cartDao.getCartById(id)
    }
    async getAllCarts() {
        return this.cartDao.getAllCarts()
    }
    // Eliminar carrito
    async deleteCart(id) {
        return this.cartDao.deleteCart(id)
    }

    // Actualizar carrito (agregando producto) 
    async addProductInCart(cartId, productId) {
        let cart = await this.cartDao.getCartById({ _id: cartId })
        const product = await this.productDao.getProductById({ _id: productId })
        const productInCart = cart.products.find((prod) => prod.id == productId)

        if (productInCart) {
            const newProductQuantity = {
                ...productInCart,
                quantity: productInCart.quantity + 1
            }
            const newCart = cart.products.filter((prod) => prod.id != newProductQuantity.id)
            newCart.push(newProductQuantity)

            cart.products = newCart
        }

        if (cart && product) {
            cart.products.push({ ...product, quantity: 1 })
        } else {
            console.log('This product no exist')
        }

        return this.cartDao.addProductInCart(cartId, cart)
    }

    // Eliminar producto dentro del carrito seleccionado
    async deleteProductInCart(cartId, productId) {
        const cart = await this.cartDao.getCartById({ _id: cartId })

        const filterCart = cart.products.filter((prod) => prod.id != productId)

        return this.cartDao.deleteProductInCart(cartId, { products: filterCart })
    }

    // Actualizar carrito
    async updateCart(cartId, newData) {
        const cart = await this.cartDao.getCartById({ _id: cartId })
        if (cart) {
            const updatedCart = { ...cart, ...newData }
            return this.cartDao.updateCart(cartId, updatedCart)
        }
    }

    // Actualizar cantidad de un producto dentro del cart
    async updateQuantity(cartId, productId, quantity) {
        let cart = await this.cartDao.getCartById({ _id: cartId })
        const product = cart.products.find((prod) => prod.id == productId)

        if (cart && product) {
            const newProductQuantity = { ...product, quantity: quantity }
            const newCart = cart.products.filter((prod) => prod.id != newProductQuantity.id)
            newCart.push(newProductQuantity)
            cart.products = newCart
        } else {
            return 'Error in updateQuantity'
        }

        return this.cartDao.updateQuantity(cartId, cart)
    }
}

export default CartRepository