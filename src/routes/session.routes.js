import { Router } from "express";
import { logoutUser } from "../controller/userControllers.js";
import userSchema from "../dao/mongo/models/userSchema.js";
import { authToken, createHash, generateToken, isValidPassword, passportCall } from "../utils.js";


const SessionRoute = Router()

SessionRoute.get("/signup", (req, res) => {
    res.render("signup")
})
// Registro con jwt
SessionRoute.post('/register', async  (req, res) => {
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
SessionRoute.post('/login', async  (req, res) => {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email: email })

    if (!user) return res.status(400).send({ status: 'errorr', error: 'Ivalid credentials' })

    if (!isValidPassword(user, password)) return res.status(400).send({ status: 'errorr', error: 'Ivalid credentials' })


    const access_token = generateToken(user)
    res.cookie('coderTokenCookie', access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    }).send({ status: 'Logged in', access_token })
})

// Route current 
SessionRoute.get('/current', passportCall('jwt'), (req, res) => {
    res.send(req.user)
})


export default SessionRoute