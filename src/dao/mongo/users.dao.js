import mongoose from "mongoose"

import userSchema from "../mongo/models/users.model.js"

class UserMongooseDao {

    //Creamos el usuario
    async createUser(user) {
        return await userSchema.create(user)
    }

    //Buscamos el usuario
    async getUser(email) {
        return await userSchema.findOne({ email: email })
    }
}

export default UserMongooseDao