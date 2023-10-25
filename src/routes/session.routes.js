import { Router } from "express";
import { createUser, currentUser, getUser } from "../controller/userControllers.js"
import userSchema from "../dao/mongo/models/userSchema.js";
import { createHash, generateToken, isValidPassword, passportCall, validateRoleAdmin } from "../utils/utils.js";
import passport from "passport";


const SessionRoute = Router()

SessionRoute.get('/', function(req, res){
    res.render('login');
});

SessionRoute.get("/signup", (req, res) => {
    res.render("signup")
})

// Registro con jwt
SessionRoute.post('/register', createUser, async (req, res) => {
    console.log(req.body)
    const { first_name, last_name, email, password, age } = req.body
    const exist = await userSchema.findOne({ email: email })
    if (exist) return res.status(400).send({ status: 'error', error: 'User already exist' })
    const user = {
        first_name,
        last_name,
        email,
        password: createHash(password),
        age
    }
    const result = await userSchema.create(user)
    const access_token = generateToken(result)
    res.cookie('coderTokenCookie', access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    }).send({ status: 'Logged in', access_token })
})

// Login con jwt
SessionRoute.post('/login', getUser, async (req, res) => {
    const { mail, password } = req.body
    console.log("veamos que datos llegan", req.body)
    const user = await userSchema.findOne({ email: mail })
    console.log("probemos esto", user.password)
    if (!user) return res.status(400).send({ status: 'errorr', error: 'Usuario no encontrado' })
    console.log(isValidPassword(password, user.password))
    if (!isValidPassword(password, user.password)) return res.status(400).send({ status: 'errorr', error: 'Ivalid credentials' })
    console.log("Estoy en la linea 49")
    const access_token = generateToken(user)
    res.cookie('coderTokenCookie', access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    }).send({ status: 'Logged in', access_token })
})

// Route current 
SessionRoute.get('/current', passportCall('jwt'), validateRoleAdmin, currentUser) 

//Github
SessionRoute.get("/api/sessions/github", passport.authenticate("github", {scope:["user: email"]}), async (req, res) => {})
SessionRoute.get("/api/sessions/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    res.redirect("/")
})
export default SessionRoute