// Importa los módulos necesarios
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { configuration } from "./config.js"
import { __dirname, authToken } from "./utils.js"
import { initializePassport}  from "./config/passport.config.js";

//importaciones de dao
import { ProductsRepository } from "./dao/repository/products.repository.js"
import { PRODUCTS_DAO } from "./dao/index.js"
import { ChatRepository } from "./dao/repository/chat.repository.js"
import { MESSAGES_DAO } from "./dao/index.js"
import { PRODUCTS_MODEL } from "./dao/mongo/models/products.model.js"

//importaciones de rutas
import { ProductsRoute } from "./routes/products.routes.js";
import { CarritoRoute } from "./routes/carts.routes.js";
import { ChatRoute } from "./routes/chat.routes.js";
import { SessionRoute }  from "./routes/session.routes.js";


//Dotenv
configuration()

//Inicializar express
const app = express()
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI

// RUTAS
app.use("/products", ProductsRoute);
app.use("/carts", CarritoRoute);
app.use("/chat", ChatRoute, authToken);
app.use("/", SessionRoute);

//Variables de entorno
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

//Conectar con mongo
mongoose.connect(MONGO_URI)

//Cookie
app.use(cookieParser("s3cr3tT"))

//Sesión con mongo
app.use(session({
    store : MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        ttl: 100
    }),
    secret: "CoderS3cr3t",
    resave: false,
    saveUninitialized: false
}))

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session()) 

//Configuración del express
app.use(express.json())
app.use(express.urlencoded({extended : true}))


//Configuración del handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "./views"));


//Uso de la carpeta public para ver el contenido / comunicación cliente servidor
app.use(express.static("public"))



// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});

server.on("error", (err) => {
  console.log(err);
});

//ioServer
const ioServer = new Server(server);

//usamos lo de dao
const productsService = new ProductsRepository(PRODUCTS_DAO)
const chatService = new ChatRepository(MESSAGES_DAO)

//Conexion con el servidor
ioServer.on("connection", async (socket) => {
  console.log("Nueva conexión establecida");
  
  //Desconeccion con el server
  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  //Agregamos un producto y los mostramos
  socket.on("new-product", async (data) => {
    const newProduct = await productsService.saveProducts(data)
    const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
    socket.emit("update-products", productos)
  });

  //Eliminamos un producto
  socket.on("delete-product", async (data) => {
    let id = data;
    let result = await ProductsModel.findByIdAndDelete(id);
    console.log("Producto eliminado", result);
    const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
    socket.emit("update-products", productos)
  });

  //Mostramos los productos
  const productos = process.env.PORT === "8080" ? await PRODUCTS_MODEL.find({}).lean({}) : await productsService.getProducts()
  socket.emit("update-products", productos)
  
  //Creamos un mensaje
  socket.on("guardar-mensaje", async (data) => {
    await chatService.createMessage(data)
    const mensajes = await chatService.getMessages()
    socket.emit("enviar-mensajes", mensajes)
  });

//Mostramos un mensaje 
  const mensajes = await chatService.getMessages()
  socket.emit("enviar-mensajes", mensajes);

  //Recibimos la cantidad de mensajes
  socket.on("Nuevos-mensajes", async (data) => {
    
    //Mosramos mensajes
    const mensajes = await chatService.getMessages()
    socket.emit("enviar-mensajes", mensajes)
  });
});

