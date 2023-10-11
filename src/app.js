// Importa los módulos necesarios
import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import { resolve } from "path"
import { Server } from "socket.io"
import { createServer } from "http";
import passport from "passport";
import __dirname, { createRoles } from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv"
import compression from "express-compression"
import MongoSingleton from "./memory/services/MongoSingleton.js"
import  initializePassport  from "./config/passport.config.js";
import Message from "./dao/mongo/models/chat.models.js"
//Importamos las rutas
import CarritoRoute from "./routes/carts.routes.js"
import ProductsRoute from "./routes/products.routes.js"
import SessionRoute from "./routes/session.routes.js"



//Dotenv
dotenv.config();
//configuration()

//Iniciamos la app
const app = express()
createRoles()
const httpserver = createServer(app)

//Definimos el puerto
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI

//Listen to server 
const httpServer = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
//Variables de entorno
// const DB_USER = process.env.DB_USER;
// const DB_PASS = process.env.DB_PASS;
// const DB_NAME = process.env.DB_NAME;

//Abrimos el servidor
httpServer.on("error", (err) => console.log(err));
//Conectar con mongo
mongoose.connect(MONGO_URI)

//Cookie

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
mongoose.set("strictQuery", false)
initializePassport()
app.use(passport.initialize())
app.use(passport.session()) 

//Configuración del express
app.use(express.json())
app.use(express.urlencoded({extended : true}))


//Configuración del handlebars
const viewsPath = resolve('src/views');
app.engine('handlebars', engine({
  layoutsDir: `${viewsPath}/layouts`,
  defaultLayout: `${viewsPath}/layouts/main.handlebars`,
}));

app.set('view engine', 'handlebars');
app.set('views', viewsPath);

// Controlador para la ruta raíz
app.get('/', function(req, res){
  res.render('login');
});

// RUTAS
app.use("/products", ProductsRoute);
app.use("/carts", CarritoRoute);
app.use("/", SessionRoute);



//Uso de la carpeta public para ver el contenido / comunicación cliente servidor
app.use(express.static("public"))

//Usamos compresion
app.use(compression())

//Iniciamos el servidor


const io = new Server(httpServer);
let messages = [];
// Configurar el evento de conexión de Socket.IO
io.on("connection", (socket) => {
  //console.log("Nuevo cliente conectado!");

  socket.on("chat message", async (msg) => {
    // Crea un nuevo mensaje y guárdalo en la base de datos
    const message = new Message({ content: msg });
    await message.save();
  });

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  // Escuchar evento 'agregarProducto' y emitir 'nuevoProductoAgregado'
  socket.on("agregarProducto", async (newProduct) => {
    //console.log("Nuevo producto recibido backend:", newProduct);
    const product = new productModel(newProduct);
    const productSave = await product.save();
    console.log(productSave);
    // Agregar el nuevo producto a la lista de productos
    io.emit("nuevoProductoAgregado", newProduct);
  });
  socket.on("disconnect", () => {
    //console.log("Cliente desconectado");
  });
});

// Conexión a la base de datos

let dbConnect = mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("strictQuery", true);

dbConnect.then(
  () => {
    console.log("Conexión a la base de datos exitosa");
  },
  (error) => {
    console.log("Error en la conexión a la base de datos", error);
  }
);