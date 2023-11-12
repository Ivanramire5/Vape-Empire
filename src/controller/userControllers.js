import UserRepository from "../dao/repository/userRepository.js"
import { createHash, generateToken } from "../utils/utils.js";
import CustomError from "../services/errors/CustomErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import jwt from "jsonwebtoken";


// Vista del registro y creacion del usuario
export const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, age, full_name, role } = req.body
        const user = {
            full_name,
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            role
        }

        if( !first_name || !last_name || !email ) {
            CustomError.createError({
                name: "User creatin error",
                cause: generateUserErrorInfo({first_name, last_name, email}),
                message: "Error en crear usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        if(user.email === "ivan.r4amire5@gmail.com"){
            user.role = "admin"
        }else{
            user.role = "user"
        }

        const manager = new UserRepository()
        const result = await manager.createUser(user)
        const access_token = generateToken(result)

        res.cookie('coderTokenCookie', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({"result": result, "jwt": access_token})

    } catch (error) {
        console.log('Error in createUser' + error)
    }
}
//Actualizamos un usuario
export const updateUser = async (req, res) => {
    try {
        const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
    const result = await usersService.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
    } catch {
        console.log("Error al momento de actualizar un usuario"+ error)
    }    
};
//Eliminamos un usuario 
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const result = await usersService.getUserById(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch {
        console.log("Error al momento de eliminar un usuario" + error)
    }
};
// Vista del login
export const getUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const manager = new UserRepository()
        const user = await manager.getUser(email, password)
        const access_token = generateToken(user)

        res.cookie('coderTokenCookie', access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).send({"result": user, "jwt": access_token})
        
    } catch (error) {
        console.log('Error in getLogin' + error)
    }
}

// Vista current
export const currentUser = async (req, res) => {
    const { user } = req.user
    const manager = new UserRepository()
    const data = await manager.getCurrentUser(user)
    res.send(data)
}

// Vista de cerrar sesion
export const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.send("Logout ok!");
        } else {
            res.json({
                status: "Error al cerrar sesion",
                body: err,
            });
        }
    });
}