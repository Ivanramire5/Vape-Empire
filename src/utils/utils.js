import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport';
import { faker } from "@faker-js/faker"
import { dirname } from "path"
import { fileURLToPath } from 'url';

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

export const isValidPassword = (savedPassword,password) =>{
    return bcrypt.compareSync(savedPassword,password)
}

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

let privateKey = "CoderKeySecreta"

export const generateToken = (user)=>{
    const token = jwt.sign({user},privateKey,{expiresIn: "1h"})
    return token
}

export const authToken = (req,res,next)=>{
    let auth = req.cookies.coderCookieToken
    if(!auth) return res.json({status: "error", message: "Invalid auth"})

    const token = auth

    jwt.verify(token,privateKey,(err,user)=>{ 
        if(err) res.json({status: "error", message: "Invalid Token"})
        req.user = user
        next()
    })
}

export const authAdmin = (req,res,next)=>{
    if(req.user.user.role === "admin" || req.user.user.role === "premium") return next() 
    return res.send({status: "error", message: "Is not admin"})
}

export const authOnlyAdmin = (req,res,next)=>{
    if(req.user.user.role === "admin") return next() 
    return res.send({status: "error", message: "Is not admin"})
}
 
export const passportCall = (strategy)=>{
    return async(req,res,next)=>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error)
            if(!user) return res.json({status: "error", message: info.messages ? info.messages : info.toString()})
            req.user = user
            next()
        })(req,res,next)
    }
}

export const authorization = (role)=>{
    return async(req,res,next)=>{
        if(!req.user) return res.json({status: "error", message: "Unauthorized"})
        if(req.user.user.role !== role) return res.json({status: "error", message: "UnauthorizeD"})
        next()
    }
}

//Creamos mocking usando faker
export const createRandomProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.department(),
        price: faker.commerce.price(),
        status: true,
        stock: faker.string.numeric(1),
        category: faker.commerce.productAdjective(),
        thumbanail: faker.image.url()
    }
}

export default __dirname;