
import sessionSchema from "./models/sesionSchema.js"

export default class Session {
    get = (params) => {
        return sessionSchema.find(params);
    };
    getAll = () => {
        return sessionSchema.find();
    };

    getBy = (params) => {
        return sessionSchema.findOne(params);
    };

    save = (doc) => {
        return sessionSchema.create(doc);
    };

    update = (id, doc) => {
        return sessionSchema.findByIdAndUpdate(id, { $set: doc });
    };

    delete = (id) => {
        return sessionSchema.findByIdAndDelete(id);
    };
}
