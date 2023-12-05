
import productSchema from "../mongo/models/productSchema.js";


export class ProductsMongooseDao {

    get = (params) => {
        return productSchema.find(params);
    };
    getAll = () => {
        return productSchema.find().lean();
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

