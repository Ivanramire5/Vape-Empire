//Importaciones
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport";
import { Strategy } from "passport-oauth2";
import { error } from "console";

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (savedPassword,password) => {
    return bcrypt.compareSync(savedPassword,password)
}

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

let privateKey = "SecretCodeKey"

export const generateToken = (user) => {
    const token = jwt.sign({user}, privateKey, {expiresIn: "2h"})
    return token
};

export const authToken = (req, res, next) => {
    let auth = req.cookes.coderCookieToken
    if(!auth) return res.json({status: "error", message: "Auth invalido"})

    const token = auth

    jwt.verify(token, privateKey, (err, user) => {
        if(err) res.json({status: "error", message: "Token invalido"})
        req.user = user
        next()
    })
};

export const authAdmin = (req, res, next) => {
    if(req.user.role != "user") return res.send({status: "error", message: "Usted no es el admin"})
    next()
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if(error) return next(error)
            if(!user) return res.json({status: "error", message: info.messages ? info.messages : info.toString()})
            req.user = user
            next()
        })(req, res, next)
    }
};

export const authorization = (role) => {
    return async (req, res, next) => {
        if(!req.user) return res.json({status: "error", message: "Unauthorized"})
        if(req.user.role !== role) return res.json({status: "error", message: "Unauthorized"})
        next()
    }
}