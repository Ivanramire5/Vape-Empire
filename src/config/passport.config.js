import GithubStrategy from "passport-github2"
import passport from 'passport'
import local from "passport-local"
import jwt, {ExtractJwt} from 'passport-jwt'
import crypto from "crypto"
import { google } from "googleapis"
import { configuration } from "./payment.config.js"
import { config } from "dotenv"
//importaciones
import { createHash } from "../utils/utils.js";
import {cart_dao} from "../dao/index.js"
import {user_dao} from "../dao/index.js"
import UserRepository from "../dao/repository/userRepository.js"

const userService = new UserRepository(user_dao)

//Nodemailer
const OAuth2 = google.auth.OAuth2;
configuration()
config();

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies){
        token = req.cookies['coderTokenCookie']
    }
    return token
}



//Oauth2
const OauthClientId = process.env.CLIENT_ID
const OauthClientSecret = process.env.CLIENT_SECRET
const oauthRefreshToken = process.env.REFRESH_TOKEN
const oauthAccessToken = process.env.ACCESS_TOKEN

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

passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderKeySecret"
    }, async(jwt_payload,done)=>{
        try{
            return done(null,jwt_payload)
        }catch(err){
            return done(err)
        }
    }  
))

passport.use("oauth2", new OAuth2({
    clientID: OauthClientId,
    clientSecret: OauthClientSecret,
    authorizationURL: "https://developers.google.com/oauthplayground",
    tokenURL: "https://developers.google.com/oauthplayground",
    callbackURL: "https://developers.google.com/oauthplayground"
    }, async(accessToken, refreshToken, profile, done)=>{
        try{
            console.log(profile)
            const user = await userService.getUserByEmail(profile?.emails[0]?.value)
            if(!user){ 
                const newUser = {
                    name: profile.displayName,
                    last_name: profile.displayName,
                    email: profile?.emails[0]?.value,
                    user: profile.username,
                    password: crypto.randomUUID()
                }
                const result = await userService.createUser(newUser)
                done(null,result)
            }else{
                done(null,user)
            }
        }catch(err){
            done(err,null)
        }
    }))
}

//jwt
const JwtStrategy = jwt.Strategy
const LocalStrategy = local.Strategy
const GithubClientId = process.env.GITHUB_CLIENT_ID
const GithubClientSecret = process.env.GITHUB_CLIENT_SECRET
const GithubURL = process.env.GITHUB_URL_CALLBACK

passport.use("github", new GithubStrategy({
    clientID : GithubClientId,
    clientSecret: GithubClientSecret,
    callbackURL: GithubURL
    }, async(accessToken,refreshToken,profile,done)=>{
        try{
            console.log(profile)
        const user = await userService.getUserByEmail(profile?.emails[0]?.value)
        if(!user){ 
            const newUser = {
                name: profile.displayName,
                last_name: profile.displayName,
                email: profile?.emails[0]?.value,
                user: profile.username,
                password: crypto.randomUUID()
            }
            const result = await userService.createUser(newUser)
            done(null,result)
        }else{
            done(null,user)
        }
    }catch(err){
        done(err,null)
    }
}))


export default initializePassport