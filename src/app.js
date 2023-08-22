
//Importaciones
import express from "express";
import { engine } from "express-handlebars";
import viewsRoutes from "./routes/views.routes.js";
import { Server } from "socket.io";
import ProductsModel from "./dao/models/products.model.js";
import path from "path";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { __dirname } from "./utils.js"
import productsRouter from "./routes/products.routes.js";
import carritoRouter from "./routes/carts.routes.js";
import chatRouter from "./routes/chat.routes.js";
import MessagesModel from "./dao/models/messages.model.js";
import sessionRouter from "./routes/session.routes.js"
import session from "express-session";
import MongoStore from "connect-mongo";

//Dotenv
dotenv.config();

//Iniciamos express
const app = express();

//Puerto
const PORT = process.env.PORT || 4040;
console.log(typeof PORT);

//Base de Mongo
const MONGO_URI = process.env.MONGO_URI;
const connection = mongoose.connect("mongodb+srv://ivanr4amire5:gatonegro97@database1.hng81to.mongodb.net/e-commerce",  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});;
connection.then(
    () => {
        console.log("Conexión a la base de datos exitosa");
    },
    (error) => {
        console.log("Error en la conexión a la base de datos", error);
    }
);

//Sesion con mongo

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        ttl: 100
    }),
    secret: "codigoSecreto",
    resave: false,
    saveUninitialized: false
}))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, "./views"));


app.use(express.static(path.join(__dirname , "/public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Autenticacion

function auth(req, res, next) {
    if(req.session.rol) {
        return next()
    } else {
        res.send("Error")
    }
}

//RUTAS
app.use("/products/",productsRouter)
app.use("/carts",carritoRouter)
app.use("/views", auth, viewsRoutes)
app.use("/chat",chatRouter)
app.use("/", sessionRouter)

app.get("/", (req, res) => {
    res.render(__dirname + "/views/home")
})
//Usamos sockets para iniciar el servidor

const server = app.listen(parseInt(PORT), ()=>{
    console.log("Listening on the port " + PORT)
})
server.on("error",(err)=>{
    console.log(err)
})

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
})