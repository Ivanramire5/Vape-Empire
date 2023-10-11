
import passport from 'passport'
import jwt from 'passport-jwt'
import * as dotenv from "dotenv"

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

const JWTstrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const initializePassport = () => {
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

}

export default initializePassport