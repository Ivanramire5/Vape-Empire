import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import * as dotenv from "dotenv"

// Config dotenv
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY

// Hasheando la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validacion de contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);



// Creacion del token
export const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(400).send({ error: 'Not authenticated' })

    const token = authHeader.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: 'Not authorized' })
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user)
                return res.status(401).json({
                    error: info.messages ? info.messages : info.toString(),
                });
            req.user = user;
            next();
        })(req, res, next);
    };
};