
import { Router } from "express";
import { changeRoleUser, uploadImage, getUsers, deleteUsers, deleteUser } from "../controller/usersController.js";
import multer from "multer";

const upload = multer({dest: "../public/images/"})

const usersRoutes = Router()

usersRoutes.get("/premium/:uid",changeRoleUser)
usersRoutes.post("/:uid/documents",upload.any(),uploadImage)
usersRoutes.get("/",getUsers)
usersRoutes.delete("/",deleteUsers)
usersRoutes.delete("/:uid",deleteUser)

export default usersRoutes