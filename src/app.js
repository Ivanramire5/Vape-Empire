// Importa los módulos necesarios
import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import {configuration} from "./config.js"
import { Server } from "socket.io";
import { __dirname, authToken } from "./utils.js"
import viewsRoutes from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import carritoRouter from "./routes/carts.routes.js";
import chatRoute from "./routes/chat.routes.js";
import initializePassport from "./config/passport.config.js";
import LoginRoute from "./routes/login.routes.js";
import ForgotRoute from "./routes/forgot.routes.js";
import SignupRoute from "./routes/signup.routes.js";
import SessionRoute from "./routes/session.routes.js";
import ProductsModel from "./dao/mongo/models/products.model.js";
import MessageModel from "./dao/mongo/models/messages.model.js";

//Dotenv
configuration()

//Inicializar express
const app = express()
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI

//Conectar con mongo
mongoose.connect(MONGO_URI)
console.log("este es el dato", "", MONGO_URI)
//Modo de trabajo
const ENVIRONMENT = process.env.ENVIRONMENT

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

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
    secret: "coderSecret",
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
app.use(express.static("../public"))

// RUTAS
app.use("/products", productsRouter);
app.use("/carts", carritoRouter);
app.use("/", LoginRoute);
app.use("/signup", SignupRoute);
app.use("/forgot", ForgotRoute);
app.use("/chat", chatRoute);
app.use("/api/sessions", SessionRoute);

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log("Listening on port " + PORT + " in " + ENVIRONMENT);
});

server.on("error", (err) => {
  console.log(err);
});

const ioServer = new Server(server);

ioServer.on("connection", async (socket) => {
  console.log("Nueva conexión establecida");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });

  socket.on("new-product", async (data) => {
    console.log("Producto agregado correctamente", data);
  });

  socket.on("delete-product", async (data) => {
    let id = data;
    let result = await ProductsModel.findByIdAndDelete(id);
    console.log("Producto eliminado", result);
  });

  const productos = await ProductsModel.find({}).lean();
  socket.emit("update-products", productos);

  socket.on("guardar-mensaje", (data) => {
    MessageModel.insertMany([data]);
  });

  const mensajes = await MessageModel.find({}).lean();
  socket.emit("enviar-mensajes", mensajes);

  socket.on("Nuevos-mensajes", (data) => {
    console.log(data + " nuevos mensajes");
  });
});

