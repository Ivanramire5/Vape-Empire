import { Router } from "express";
import passport from "passport";
import { user_dao } from "../dao/index.js";
import { transport } from "../mailer/nodemailer.js";
import { createHash, generateToken, isValidPassword, passportCall, authorization } from "../utils/utils.js";
import UserRepository from "../dao/repository/userRepository.js";

const userService = new UserRepository(user_dao)

const SessionRoute = Router()

SessionRoute.get('/', function(req, res){
    res.render('login');
});

SessionRoute.get("/signup", (req, res) => {
    res.render("signup")
})

// Registro con jwt
SessionRoute.post("/register",passport.authenticate("register",{
    failureRedirect: "/failRegister"}),async(req,res)=>{
        res.json({status: "success", message: "Usuario registrado"})
})

SessionRoute.get("/failRegister",(req,res)=>{
    res.send({error:"Error register"})
})

// Login con jwt
SessionRoute.post("/login",async(req,res)=>{
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

// Route current 
SessionRoute.get('/current', passportCall('jwt'),authorization("user"),(req,res)=>{
    res.send({fullname: req.user.user.fullname, age: req.user.user.age, role: req.user.user.role}) 
})

SessionRoute.get("/failLogin",(req,res)=>{
    res.send({error: "Error login"})
})

SessionRoute.post("/logout",(req,res)=>{
    req.session.destroy(async err=>{
        if(!err){
            const {email} = req.body
            const user = await userService.getUserByEmail(email)
            user.last_connection = new Date()
            const response = await userService.modifyUser(user.id,user)
            return res.json({
                message: "Sesión cerrada",response
            })
        }else{
            return res.json({
                message: "Error al cerrar sesión"
            }) 
        }
    })
})
//Github
SessionRoute.get("/api/sessions/github", passport.authenticate("github", {scope:["user: email"]}), async (req, res) => {})
SessionRoute.get("/api/sessions/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/")
})

SessionRoute.get("/recover",(req,res)=>{
    res.render("recoverPassword", {title: "Recover password", script: "recoverPassword.js", style: "recoverPassword.css", PORT: process.env.PORT})
})

SessionRoute.post("/recovePassword",async(req,res)=>{
    const {mail} = req.body
    try{
        await transport.sendMail({
            from: "Forgot password <coder123@gmail.com>", 
            to: mail,
            subject: "Forgot password",
            headers: {
                'Expiry-Date': new Date(Date.now() + 3600 * 1000).toUTCString()
            },
            html: `
                <h1>Forgot password</h1>
                <a href="http://localhost:${process.env.PORT}/replacePassword"><button>Recuperar contraseña</button></a>
            `
        })
        userTemp = await userService.getUserByEmail(mail)
        res.json({status: "success", message: "Mail sended"})
    }catch(err){
        console.log(err)
    }
})

SessionRoute.get("/replacePassword",(req,res)=>{
    res.render("replacePassword", {title: "Replace Password", style: "replacePassword.css", script: "replacePassword.js"})
})

SessionRoute.post("/replace",async(req,res)=>{
    try{
    const {pass} = req.body
    const user = await userService.getUserByEmail(userTemp.email)
    console.log(user.password)
    if(isValidPassword(pass,user.password)){
        return res.json({status: "error", message: "same password"})
    }else{
        user.password = createHash(pass)
        const data = await userService.modifyUser(user.id,user)
        res.json({status: "Success", message: "Password replaced", data})
    }
    }catch(err){
        console.log(err)
    }
})
export default SessionRoute