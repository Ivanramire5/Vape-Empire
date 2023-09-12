
//Importaciones
import express from "express";
import  { engine }  from "express-handlebars";
import viewsRoutes from "./routes/views.routes.js";
import { Server } from "socket.io";
import ProductsModel from "./dao/models/products.model.js";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import  __dirname  from "./utils.js"
import productsRouter from "./routes/products.routes.js";
import carritoRouter from "./routes/carts.routes.js";
import chatRoute from "./routes/chat.routes.js";
import MessagesModel from "./dao/models/messages.model.js";
import sessionRoute from "./routes/session.routes.js"
import  isValidPassword  from "./utils.js";
import initializePassport from "./config/passport.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import LoginRoute from "./routes/login.routes.js";
import ForgotRoute from "./routes/forgot.routes.js";
import SignupRoute from "./routes/signup.routes.js";
import SessionRoute from "./routes/session.routes.js";
//Dotenv
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

//Puertos

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const STRING_CONNECTION = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.pnpufdn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;


//Iniciamos express y lo usamos

const app = express();
app.use(cookieParser("s3cr3t"))
const PORT = process.env.PORT || 3000;

app.engine("handlebars", engine());
app.set("view engine",  "handlebars");
app.set('views', path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname , "/public")))
app.use(express.json());

//Sesion con mongo
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 30
    }),
    secret: "mi_secreto",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}))


//Iniciamos el passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


//Base de Mongo
const MONGO_URI = process.env.MONGO_URI;

//Usamos mongoose
const connection = mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
connection.then(
    () => {
        console.log("Conexión a la base de datos exitosa");
    },
    (error) => {
        console.log("Error en la conexión a la base de datos", error);
    }
);



//Autenticacion
function auth(req, res, next) {
    if(req.session.rol) {
        return next()
    } else {
        res.send("Error")
    }
    
}

//RUTAS
app.use("/products", productsRouter)
app.use("/carts", carritoRouter)
app.use("/", LoginRoute)
app.use("/signup", SignupRoute)
app.use("/forgot", ForgotRoute)
app.use("/chat", chatRoute)
app.use("/api/sessions", SessionRoute)


//Usamos sockets para iniciar el servidor


const server = app.listen(PORT, ()=>{
    console.log(`Listening on the port ${PORT}`)
})
server.on("error", (err) => {
    console.log("Error en servidor", err);
});

const environment = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
    }
};

environment();
/*


const ioServer = new Server(server)

ioServer.on("connection", async (socket) => {
    console.log("Nueva conexión establecida");

    socket.on("disconnect",()=>{
        console.log("Usuario desconectado")
    })

    socket.on("new-product", async (data) => {
        let title = data.title
        let description = data.description
        let code = data.code
        let price = +data.price
        let stock = +data.stock
        let category = data.category
        let thumbnail = data.thumbnail
        console.log(title,description,code,price,stock,category,thumbnail)
        console.log("Producto agregado correctamente")
    });

    socket.on("delete-product",async(data)=>{ 
        let id = data;
        let result = await ProductsModel.findByIdAndDelete(id);
        console.log("Producto eliminado", result);
    })
    socket.on("new-user", async(data) => {
        console.log(data)
    })

    const products = await ProductsModel.find({}).lean()
    socket.emit("update-products", products)

    socket.on("guardar-mensaje",(data)=>{
        MessagesModel.insertMany([data])
    })
    const messagE = [];
    socket.on("message", async (data) => {
        messagE.push(data)
        console.log("Capturando el mensaje del cliente", data)
        ioServer.emit("messageLogs", messagE)
        const mensajes = await MessagesModel.find({}).lean()
        socket.emit("messageLogs", mensajes)
        socket.on("Nuevos-mensajes",(data)=> {
            console.log(data + "nuevos mensajes")
        })
    })
})*/