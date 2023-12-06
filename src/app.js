import express from "express";
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import { engine } from 'express-handlebars';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { createRequire } from 'module';
import { addLogger } from './middlewares/loggers/logger.js'
import session from "express-session"
import passport from 'passport';
import path from 'path';

import morgan from "morgan";
import cors from "cors"
import * as dotenv from "dotenv"
import initializePassport from "./config/passport.config.js"
import MongoStore from 'connect-mongo'
import errorHandler from "./middlewares/errors/index.js"
import swaggerJsdoc from "swagger-jsdoc";
import SwaggerUiExpress from "swagger-ui-express";
import __dirname from "./utils/utils.js"

//Importamos las rutas
import CarritoRoute from "./routes/carts.routes.js"
import ProductsRoute from "./routes/products.routes.js"
import SessionRoute from "./routes/session.routes.js"
import MockRoute from "./routes/mock.routes.js"
import ChatRouter from "./routes/chat.routes.js"
import loggerTest from "./routes/loggerTest.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import usersRoutes from "./routes/users.routes.js";

//Dotenv
dotenv.config();

//Definimos el puerto
const MONGO_URI = process.env.MONGO_URI
const connection = mongoose.connect(MONGO_URI)

//Iniciamos la app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(errorHandler)
app.use(cors())

//Morgan
app.use(morgan("dev"))

//Cookie
app.use(cookieParser("C0D3RS3CR3T"))

//Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Vape Empire",
      description: "Probamos API de Swagger para el proyecto final"
    }
  },
  apis: ["./src/docs/**/*.yaml"],
}

//Conexion de swagger
const specs = swaggerJsdoc(swaggerOptions);

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

//Configuración de JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET 
};

const strategy = new Strategy(jwtOptions, function (payload, done) {

});

passport.use(strategy);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

try {
  await mongoose.connect(MONGO_URI)
  console.log("Base de datos conectada");
} catch (error) {
  console.log(error)
}

//cookies
app.use(cookieParser())

//Variables de entorno
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const NODE_ENV = process.env.NODE_ENV;
const ENVIRONMENT = process.env.ENVIRONMENT;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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
app.use("/users", usersRoutes)
app.use("/mockingproducts", MockRoute)
app.use(paymentRoutes)

app.use("/apidocs", SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))
app.use

//Uso de la carpeta public para ver el contenido / comunicación cliente servidor
app.use(express.static("public"))

//Port
const PORT = process.env.PORT || 8080;
// //Iniciamos el servidor
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error al iniciar el servidor:', err);
  } else {
  console.log(`Listening on port ${PORT} node_env: ${process.env.NODE_ENV}`)
  console.log(`environment: ${ENVIRONMENT}`);
  }
})
