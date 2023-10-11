
// //Configuramos el dotenv
// import { configuration } from "../config.js"
// configuration()

// //Colocamos el memory
// import { ProductsMemoryDao } from "./memory/products.dao.js"
// import { CarritoMemoryDao } from "./memory/carrito.dao.js"
// import { UsersMemoryDao } from "./mongo/users.dao.js"

// import { ChatMemoryDao } from "./memory/chat.dao.js";
// import { TicketMemoryDao } from "./memory/ticket.dao.js"

// //Mongo
// import { CarritoMongoDao } from "./mongo/carrito.dao.js"
// import { UsersMongoDao } from "./memory/users.dao.js"
// import { ChatMongoDao } from "./mongo/chat.dao.js"
// import { TicketMongoDao } from "./mongo/ticket.dao.js"

// //Exportaciones de DAO
// export const PRODUCTS_DAO = process.env.PERSISTENCE === "MONGO" ?  new ProductsMongoDao() : new ProductsMemoryDao()
// export const CARTS_DAO = process.env.PERSISTENCE === "MONGO" ?  new CarritoMongoDao() : new CarritoMemoryDao()
// export const USER_DAO = process.env.PERSISTENCE === "MONGO" ? new UsersMongoDao() : new UsersMemoryDao()
// export const MESSAGES_DAO = process.env.PERSISTENCE === "MONGO" ?  new ChatMongoDao() : new ChatMemoryDao()
// export const TICKET_DAO = process.env.PERSISTENCE === "MONGO" ? new TicketMongoDao() : new TicketMemoryDao()