import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local"
import * as dotenv from "dotenv"
import  { UserModel }  from "../dao/mongo/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import crypto from "crypto"
import CartsModel from "../dao/mongo/models/carts.model.js";
import jwt, { ExtractJwt } from "passport-jwt"

dotenv.config();
const LocalStrategy = local.Strategy
const JwtStrategy = jwt.Strategy
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const initializePassport = () => {
    passport.use("register",new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"},async(req,mail,pass,done)=>{
            const {first_name,last_name,email,age,password} = req.body
            try{
                const userAccount = await UserModel.findOne({email: email})
                if(userAccount){
                    return done(null,false,{message: "Tu usuario ya existe"})
                }else{
                    const carrito = {
                        products : []
                    }
                    let cart = await CartsModel.create(carrito)
                    const newUser = { 
                        first_name,
                        last_name,
                        email,
                        age,
                        cart: cart.id,
                        role: "user",
                        password: createHash(password)
                    }
                    const result = await UserModel.create(newUser)
                    console.log(result)
                    return done(null,result)
                }
            }catch(err){
                return done(err)
            }
        }))

    passport.use("jwt", new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderKeySecreta"
    },async(jwt_payload,done)=>{
        try{
            return done(null,jwt_payload)
        }catch(err){
            return done(err)
        }
    }))
        passport.use("github", new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userService.findOne({
                email: profile?.emails[0]?.value,
            });
            if (!user) { 
                const newUser = {
                    first_name: profile.displayName.split(" ")[0],
                    last_name: profile.displayName.split(" ")[1],
                    email: profile?.emails[0]?.value,
                    age: 18,
                    password: crypto.randomBytes(20).toString("hex"),
                };
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
            } catch (err) {
                done(err, null);
            }
        }
    )
);
    passport.serializeUser((user, done) => {
    done(null, user._id);
});

    passport.deserializeUser(async (id, done) => {
    try {
            let user = await userService.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};

const cookieExtractor = (req)=>{
    let token = null
    if(req && req.cookies){
        token = req.cookies["coderCookieToken"]
    }
    return token
}



export default initializePassport;
