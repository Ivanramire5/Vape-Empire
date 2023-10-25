// Importa los módulos necesarios
import express from "express";
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import { engine } from 'express-handlebars';
import { createRequire } from 'module';
import { addLogger } from './middlewares/loggers/logger.js'
import session from "express-session"
import passport from 'passport';
import path from 'path';
import * as dotenv from "dotenv"
import initializePassport from "./config/passport.config.js"
import MongoStore from 'connect-mongo'
import errorHandler from "./middlewares/errors/index.js"

//Importamos las rutas
import CarritoRoute from "./routes/carts.routes.js"
import ProductsRoute from "./routes/products.routes.js"
import SessionRoute from "./routes/session.routes.js"
import MockRoute from "./routes/mock.routes.js"
import ChatRouter  from "./routes/chat.routes.js"
import loggerTest from "./routes/loggerTest.routes.js"

//Dotenv
dotenv.config();
//Definimos el puerto
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI
//configuration()

//Iniciamos la app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)



//session con mongo
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: "codersecret",
    resave: false,
    saveUninitialized: false,
  })
);
mongoose.set("strictQuery", false);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

try {
  await mongoose.connect(MONGO_URI)
  console.log("Base de datos conectada");
} catch (error) {
  console.log(error)
}


//Variables de entorno
// const DB_USER = process.env.DB_USER;
// const DB_PASS = process.env.DB_PASS;
// const DB_NAME = process.env.DB_NAME;

//Conectar con mongo

//Configuración del handlebars

const viewsPath = path.resolve('src/views');
app.engine('handlebars', engine({
  layoutsDir: `${viewsPath}/layouts`,
  defaultLayout: `${viewsPath}/layouts/main.handlebars`,
}));

app.set('view engine', 'handlebars');
app.set('views', viewsPath);

//Logger
app.use(addLogger)
app.use("/api/loggerTest", loggerTest)

// RUTAS
app.use("/chat", ChatRouter);
app.use("/products", ProductsRoute);
app.use("/carts", CarritoRoute);
app.use("/", SessionRoute);
app.use("/mockingproducts", MockRoute)


//Uso de la carpeta public para ver el contenido / comunicación cliente servidor
app.use(express.static("public"))

// //Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Server connected in port ${PORT}`)
})

// const io = new Server(httpServer);
// let messages = [];
// // Configurar el evento de conexión de Socket.IO
// io.on("connection", (socket) => {
//   //console.log("Nuevo cliente conectado!");

//   socket.on("chat message", async (msg) => {
//     // Crea un nuevo mensaje y guárdalo en la base de datos
//     const message = new Message({ content: msg });
//     await message.save();
//   });

//   socket.on("message", (data) => {
//     messages.push(data);
//     io.emit("messageLogs", messages);
//   });

//   // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
//   socket.on("agregarProducto", async (newProduct) => {
//     //console.log("Nuevo producto recibido backend:", newProduct);
//     const product = new productModel(newProduct);
//     const productSave = await product.save();
//     console.log(productSave);
//     // Agregar el nuevo producto a la lista de productos
//     io.emit("nuevoProductoAgregado", newProduct);
//   });
//   socket.on("disconnect", () => {
//     //console.log("Cliente desconectado");
//   });
// });

// // Conexión a la base de datos

// let dbConnect = mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// mongoose.set("strictQuery", true);

