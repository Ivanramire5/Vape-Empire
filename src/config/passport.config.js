import GitHubStrategy from "passport-github2"
import passport from 'passport'
import local from "passport-local"
import jwt from 'passport-jwt'
import crypto from "crypto"
import * as dotenv from "dotenv"
import { configuration } from "./payment.config.js"

//importaciones
import {cart_dao} from "../dao/index.js"
import {user_dao} from "../dao/index.js"
import UserRepository from "../dao/repository/userRepository.js"

const userService = new UserRepository(user_dao)

configuration()

const PRIVATE_KEY = process.env.PRIVATE_KEY

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies){
        token = req.cookies['coderTokenCookie']
    }
    return token
}

//jwt
const JWTstrategy = jwt.Strategy
const LocalStrategy = local.Strategy
const ExtractJWT = jwt.ExtractJwt
const GithubClientId = process.env.GITHUB_CLIENT_ID
const GithubClientSecret = process.env.GITHUB_CLIENT_SECRET
const GithubURL = process.env.GITHUB_URL_CALLBACK

const initializePassport = async () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"},async(req,mail,pass,done)=>{
            const {first_name,last_name,email,age,password} = req.body
            try{
                const userAccount = await userService.getUserByEmail(email)
                if(userAccount){
                    return done(null,false,{message: "Tu usuario ya existe"})
                }else{
                    const CART = {
                        products : []
                    }
                    let cart = await cart_dao.saveCart(CART) 
                    const newUser = { 
                        first_name,
                        last_name,
                        email,
                        age,
                        cart: cart.id,
                        role: "user", 
                        password: createHash(password)
                    }
                    const result = await userService.createUser(newUser)
                    return done(null,result)
                }
            }catch(err){
                return done(err)
            }
    }))
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })

    passport.use('jwt', new JWTstrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch (error) {
                return done(error)
            }
        }
    ))
    passport.use("github", new GitHubStrategy({
        clientID: GithubClientId,
        clientSecret: GithubClientSecret,
        callbackURL: GithubURL
    }, async (accessToken, refresToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.getUserByEmail(profile?.emails[0]?.value)
            if (!user) {
                let newUser = {
                    name: profile.displayName,
                    last_name: profile.displayName,
                    email: profile?.emails[0]?.value,
                    user: profile.username,
                    password: crypto.randomUUID()
                }
                console.log("Error", newUser)
                let result = await userService.createUser(newUser);
                done (null, result);
            }
            else {
                done(null, user)
            } 
        } catch (err) {
            done(err, null)
        }
    }))
}

export default initializePassport