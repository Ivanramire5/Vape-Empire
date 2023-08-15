
import express from "express";
import { engine } from "express-handlebars";
import viewsRoutes from "../routes/views.routes";
import { Server } from "socket.io";
import ProductsModel from "./src/dao/models/products.model.js";
import path from "path";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./src/routes/products.routes.js";
import carritoRouter from "./src/routes/carts.routes.js";
import chatRouter from "./src/routes/chat.routes.js";
import MessagesModel from "./src/dao/models/messages.model.js";
import productManager from "./src/dao/dbManager/productManager.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const connection = mongoose.connect(MONGO_URI, {
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(path.dirname(new URL(import.meta.url).pathname), "views"));

app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), "../public")));

app.use("/productos",productsRouter)
app.use("/carts",carritoRouter)
app.use("/",viewsRoutes)
app.use("/chat",chatRouter)
app.use("/", productManager)

//Usamos sockets
const server = app.listen(PORT,()=>{
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
    

    const productos = await ProductsModel.find({}).lean()
    socket.emit("update-products", productos)

    socket.on("guardar-mensaje",(data)=>{
        MessagesModel.insertMany([data])
    })

    const mensajes = await MessagesModel.find({}).lean()
    socket.emit("enviar-mensajes",mensajes)
    socket.on("Nuevos-mensajes",(data)=>{
        console.log(data + " nuevos mensajes")
    })
});