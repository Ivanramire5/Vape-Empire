
import { configuration } from "../config/payment.config.js";
configuration()

//Winston
import winston from "winston"

const devLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "debug"
        }),
        new winston.transports.Console({
            level: "http"
        })
    ]
})

const prodLogger = winston.createLogger({
    transports:[
        new winston.transports.Console({
            level: "info"
        }),
        new winston.transports.Console({
            level: "warn"
        }),
        new winston.transports.File({
            level: "error",
            filename: "./errors.log"
        }),
        new winston.transports.Console({
            level: "verbose"
        })
    ]
})

//Memory
import {ProductsMemoryDao} from "./memory/products.dao.js"
import {CarritoMemoryDao} from "./memory/cart.dao.js"
import { UsersMemoryDao } from "./memory/users.dao.js"
import { ChatMemoryDao } from "./memory/chat.dao.js"
import { TicketMemoryDao } from "./memory/ticket.dao.js"

//Mongo
import {ProductsMongooseDao} from "./mongo/ProductMongooseDao.js"
import {CartMongooseDao} from "./mongo/CartMongooseDao.js"
import { User } from "./mongo/UserMongooseDao.js"
import { ChatMongooseDao } from "./mongo/ChatMongooseDao.js"
import { ticketMongooseDao } from "./mongo/ticketMongooseDao.js"

export const product_dao = process.env.PERSISTENCE === "MONGO" ?  new ProductsMongooseDao() : new ProductsMemoryDao()
export const cart_dao = process.env.PERSISTENCE === "MONGO" ?  new CartMongooseDao() : new CarritoMemoryDao()
export const user_dao = process.env.PERSISTENCE === "MONGO" ? new User() : new UsersMemoryDao()
export const message_dao = process.env.PERSISTENCE === "MONGO" ?  new ChatMongooseDao() : new ChatMemoryDao()
export const ticket_dao = process.env.PERSISTENCE === "MONGO" ? new ticketMongooseDao() : new TicketMemoryDao()
export const logger = process.env.ENVIRONMENT === "DEVELOPMENT" ? devLogger : prodLogger