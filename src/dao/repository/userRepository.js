
import UserDTO from "../DTO/users.dto.js"
import {User} from "../../dao/mongo/UserMongooseDao.js"
import { isValidPassword } from "../../utils/utils.js"


class UserRepository {
    constructor() {
        this.userDao = new User()
    }

    // Creacion del usuario
    async createUser(user) {
        const exist = await this.userDao.getUser(user.email)
        if (exist) return { status: 'error', error: 'User already exist' }

        const newUser = new UserDTO(user)
        const userFinally = await this.userDao.createUser(newUser)
        return userFinally
    }

    // Verifico si el usuario existe
    async getUser(email, password) {
        const emailExist = await this.userDao.getUser(email)

        if (!emailExist) {
            return { status: 500, message: 'Usuario incorrecto o inexistente.' }
        } else {
            if (!isValidPassword(emailExist, password)) {
                return { status: 500, message: 'Contraseña incorrecta.' }
            } else {
                return emailExist
            }
        }
    }

    // Ruta current
    async getCurrentUser(user) {
        const exist = await this.userDao.getUser(user.email)

        if (!exist) {
            return { status: 500, message: 'Usuario sin permisos.' }
        } else {
            const newUser = new UserDTO(user)
            return { status: 200, message: "Bienvenido " + newUser.full_name }
        }
    }
}

export default UserRepository