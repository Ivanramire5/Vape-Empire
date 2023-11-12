import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'Products'

const productSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "default status"
    },
    title: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    _id: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },   
    code: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        index: true,
    },
    thumbnail: {
        type: String,
        required: true
    }
})


productSchema.plugin(mongoosePaginate)

export default mongoose.model(productCollection, productSchema) 