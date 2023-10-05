
import { Router } from "express";
import { isValidPassword } from "../utils.js";
import passport from "passport";
import { generateToken, passportCall, authorization } from "../utils.js";
import { UsersRepository } from "../dao/repository/users.repository.js";
import { USER_DAO } from "../dao/index.js";

const userService = new UsersRepository(USER_DAO)

//Iniciamos el router
const SessionRoute = Router()

//Formulario de registro
SessionRoute.get("/signup", (req, res) => {
    res.render("signup", {title: "Register", PORT: process.env.PORT})
})

//Vista del formulario de login
SessionRoute.get("/",(req,res)=>{
    res.render("login",{title: "Login", PORT: process.env.PORT})
})

//Registro with passport
SessionRoute.post("/register",passport.authenticate("register",{
    failureRedirect: "/failRegister"}),async(req,res) => {
        res.json({status: "success", message: "Usuario registrado"})
})

//Por si falla el registro
SessionRoute.get("/failRegister",(req,res) => {
    res.send({error:"Error register"})
})

//JWT
SessionRoute.post("/signup",async(req,res) => {
    const {email,password} = req.body
    const user = await userService.getUserByEmail(email)
    if(!user){
        return res.json({status: "error", message: "User not found"})
    }else{
        if(!isValidPassword(password,user.password)){
            return res.json({status: "error", message: "Invalid password"})
        }else{
            const myToken = generateToken(user)
            res.cookie("coderCookieToken",myToken,{ 
               maxAge: 60 * 60 * 1000,
                httpOnly: true
            })
            res.json({status: "success"})  
        }
    }
})
SessionRoute.get("/current",passportCall("jwt"),authorization("user"),(req,res)=>{
    res.send({fullname: req.user.user.fullname, age: req.user.user.age, role: req.user.user.role}) 
})

//Por si falla el login
SessionRoute.get("/failLogin",(req,res) => {
    res.send({error: "Error login"})
})

//Cerrar sesion
SessionRoute.get("/logout",(req,res) => {
    req.session.destroy(err => {
        if(!err){
            return res.json({
                message: "Sesión cerrada"
            })
            }else {
                return res.json({
                message: "Error al cerrar sesión"
            }) 
        }
    })
})

//Github
SessionRoute.get("/api/sessions/github",passport.authenticate("github", {scope:["user:email"]}) ,async(req,res) => {})

SessionRoute.get("/api/sessions/githubcallback", passport.authenticate("github", {failureRedirect: "/", session: false}),async(req,res)=>{
    res.redirect("/views")
})

export { SessionRoute }