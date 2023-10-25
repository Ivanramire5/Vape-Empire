import GitHubStrategy from "passport-github2"
import passport from 'passport'
import jwt from 'passport-jwt'
import * as dotenv from "dotenv"
import userService from "../dao/mongo/models/userSchema.js"
// Config dotenv
dotenv.config();
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
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {

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
        clientID: "Iv1.a6b3e257ff3510f8",
        clientSecret: "38db51a7ed6fc69c00d841262fb57242918aada5",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refresToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: `ivan1234567@gmail.com`, })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "F",
                    age: 18,
                    email: "ivan1234567@gmail.com",
                    password: "123"
                }
                console.log("Error", newUser)
                let result = await userService.create(newUser);
                done (null, result);
            }
            else {
                done(null, user)
            } 
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport