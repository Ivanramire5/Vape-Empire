
import CartRepository from "../dao/repository/cartRepository.js"


// Creacion del carrito con su respectivo id
export const createCart = async (req, res) => {
    try {
        const manager = new CartRepository()
        const cart = await manager.createCart()
        res.send({ status: 'sucess', cart, message: 'Cart created.' })
    } catch (error) {
        console.log('Error in createCart' + error)
    }
}

export const getAllCarts = async (req, res) => {
    try {
        const manager = new CartRepository()
        const cart = await manager.getAllCarts()
        res.send({ status: 'sucess', cart })
    } catch (error) {
        console.log('Error in getAllCarts' + error)
    }
}
// Obtener carrito segun su id
export const getCartById = async (req, res) => {
    try {
        const { id } = req.params
        const manager = new CartRepository()
        const cart = await manager.getCartById(id)
        res.send({ status: 'sucess', cart })
    } catch (error) {
        console.log('Error in getCartById' + error)
    }
}

// Eliminar carrito segun su id
export const deleteCart = async (req, res) => {
    try {
        const { id } = req.params
        const manager = new CartRepository()
        const cart = await manager.deleteCart(id)
        res.send({ status: 'sucess', cart, message: 'Cart deleted' })
    } catch (error) {
        console.log('Error in deleteCart' + error)
    }
}

// Obtener carrito segun su ID y agregar producto en el mismo
export const addProductInCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cartManager = new CartRepository()
        const data = await cartManager.addProductInCart(cartId, productId)
        res.send({ status: 'sucess', data, message: 'Product added in cart.' })
    } catch (error) {
        console.log('Error in addProductInCart' + error)
    }
}

// Eliminar producto dentro del carrito seleccionado
export const deleteProductInCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cartManager = new CartRepository()
        const data = await cartManager.deleteProductInCart(cartId, productId)
        res.send({ status: 'sucess', data, message: 'Product deleted.' })
    } catch (error) {
        console.log('Error in deleteProductInCart' + error)
    }
}

// Actualizar el carrito 
export const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const newData = req.body
        const manager = new CartRepository()
        const result = await manager.updateCart(cartId, newData)
        res.send({ status: 'sucess', cart: result, message: 'Product updated.' })
    } catch (error) {
        console.log('Error in updateCart ' + error)
    }
}

// Actualizar cantidad de un producto dentro del cart
export const updateQuantity = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body
        const manager = new CartRepository()
        const result = await manager.updateQuantity(cartId, productId, quantity)
        res.send({ status: 'sucess', cart: result, message: 'Quantity updated.' })
    } catch (error) {
        console.log('Error in updateQuantity' + error)
    }
}