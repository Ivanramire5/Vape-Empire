import userSchema from "./models/userSchema.js"

export class User {
    get = (params) => {
        return userSchema.find(params);
    };
    getAll = () => {
        return userSchema.find();
    };

    getBy = (params) => {
        return userSchema.findOne(params);
    };

    save = (doc) => {
        return userSchema.create(doc);
    };

    update = (id, doc) => {
        return userSchema.findByIdAndUpdate(id, { $set: doc });
    };

    delete = (id) => {
        return userSchema.findByIdAndDelete(id);
    };
}