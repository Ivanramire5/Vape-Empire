import userSchema from "./models/userSchema.js"

class UserMongooseDao {

    // Crear user
    async createUser(user) {
        return await userSchema.create(user)
    }

    // Buscar user
    async getUser(email) {
        return await userSchema.findOne({ email: email })
    }
}

export default UserMongooseDao