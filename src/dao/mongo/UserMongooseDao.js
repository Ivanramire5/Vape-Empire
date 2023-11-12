import userSchema from "./models/userSchema.js"

export default class Users {
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


// class UserMongooseDao {

//     // Crear user
//     async createUser(user) {
//         return await userSchema.create(user)
//     }

//     // Buscar user
//     async getUser(email) {
//         return await userSchema.findOne({ email: email })
//     }

//     //Creamos el archivo de tipo dao para realizar el test de Users.test.js utilizando mocha
//     async save(doc) {
//         return await userSchema.create(doc)
//     }
// }
//export default UserMongooseDao