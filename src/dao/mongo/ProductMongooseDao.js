
import productSchema from "../mongo/models/productSchema.js";


export default class Products {

    get = (params) => {
        return productSchema.find(params);
    };
    getAll = () => {
        return productSchema.find();
    };

    getBy = (params) => {
        return productSchema.findOne(params);
    };

    save = (doc) => {
        return productSchema.create(doc);
    };

    update = (id, doc) => {
        return productSchema.findByIdAndUpdate(id, { $set: doc });
    };

    delete = (id) => {
        return productSchema.findByIdAndDelete(id);
    };
}

// export default class Products {

//     // Obtener todos los productos
//     async getProducts(aggregationStages, pagination) {
//         //console.log("Prueba 2", pagination) //Viene como un dato null
//         //const data = await productSchema.paginate({ category: pagination.category }, { limit: pagination.limit, page: pagination.page})
//         const data = await productSchema.find()
//         console.log(data)
//         return data
        
//         //return productSchema.aggregate(aggregationStages)
//     }

//     // Crear productos
//     async createProduct(data) {
//         const product = await productSchema.create(data)
//         return {
//             id: product.id,
//             title: product.title,
//             description: product.description,
//             code: product.code,
//             price: product.price,
//             status: product.status,
//             stock: product.stock,
//             category: product.category,
//             thumbnail: product.thumbnail
//         }
//     }
//     // Obtener producto por id
//     async getProductByid(id) {
//         const product = await productSchema.findOne({ id: id })

//         return {
//             id: product.id,
//             title: product.title,
//             description: product.description,
//             code: product.code,
//             price: product.price,
//             status: product.status,
//             stock: product.stock,
//             category: product.category,
//             thumbnail: product.thumbnail
//         }
//     }

//     // Acutalizar producto por id
//     async updateProduct(id, data) {
//         const product = await productSchema.updateOne({ id: id }, data)
//         return product
//     }

//     // Borrar producto por id
//     async deleteProduct(id) {
//         return productSchema.deleteOne({ id: id })
//     }
// }
