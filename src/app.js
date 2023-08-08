import { engine } from "express-handlebars";
import express from "express";
import { __filename, __dirname } from "./utils.js";
import viewsRoutes from "./router/views.router.js";
import viewsRealTime from "./router/realTimeProduct.router.js";
import { Server } from "socket.io";
import { guardarProducto } from "./services/productUtils.js"
import { eliminarProducto } from "./services/productUtils.js"
import cartRouter from "./router/cart.router.js"
import * as dotenv from "dotenv";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

let messages = [];
const io = new Server(httpServer)

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));



app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/products", viewsRealTime);
app.use("/cartrouter", cartRouter)
app.use("/", viewsRoutes)



io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado!");
    socket.on("new-user", (data) => {
        socket.user = data.user;
        socket.id = data.id;
        io.emit("new-user-connected", {
        user: socket.user,
        id: socket.id,
        });
    });
    socket.on("message", (data) => {
        messages.push(data);
        io.emit("messageLogs", messages);
    });

    socket.on("agregarProducto", (nuevoProducto) => {
        console.log("Nuevo producto recibido desde el backend:", nuevoProducto);
        guardarProducto(nuevoProducto);
        socket.emit("Nuevo producto agregado", nuevoProducto)
    });
    socket.on("btnEliminar", productId => {
        const {id} = productId
        eliminarProducto(id)
        socket.emit('btnEliminar', id)
    })
    socket.on("disconnect", () => {
        console.log("El cliente se desconectó")
    })
})

