
//Importamos el modulo
import { UsersDto } from "../DTO/users.dto.js"

//Definimos una clase y usamos un constructor para interactuar con una base de datos
export class UsersRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getUsers() {
        return await this.dao.getUsers()
    } //Recupera todos los usuarios de la base de datos

    async getUserByEmail(email) {
        return await this.dao.getUserByEmail(email)
    } //Busca un usuario mediante su direccion de email

    async createUser(user) {
        const userDto = new UsersDto(user)
        return await this.dao.createUser(userDto)
    } //Crea un usuario

    async deleteUser(id) {
        return await this.dao.deleteUser(id)
    } //Elimina un usuario

    async getUserById(id) {
        return await this.dao.getUserById(id)
    } //Recupera un usuario usando su id
}