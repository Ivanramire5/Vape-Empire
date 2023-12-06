
import mongoose from "mongoose";

const cartCollection = 'Carts'

const CartSchema = new mongoose.Schema({
    products: {
        type: Array,
        index: true,
        default: [],
        ref: 'Products'
    }
})

export default mongoose.model(cartCollection, CartSchema)