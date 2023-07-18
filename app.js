import { engine } from "express-handlebars";
import express from "express";
import { __filename, __dirname } from "./utils.js";
import viewsRoutes from "./router/views.router.js";
import viewsRealTime from "./router/realTimeProduct.router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { guardarProducto } from "./services/productUtils.js"


const app = express();
const httpServer = createServer(app)

const PORT = 4000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/", viewsRoutes);
app.use("/realtime", viewsRealTime);


httpServer.listen(PORT, () => {
    console.log(`El servidor está ejecutandose en http://localhost: ${PORT}`)
});


const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente en linea");

    socket.on("mensaje", (data) => {
        console.log("Mensaje:", data)

        socket.emit("respuesta", "Mensaje recibido correctamente")
    });

    socket.on("agregarProducto", (nuevoProducto) => {
        console.log("Nuevo producto recibido desde el backend:", nuevoProducto);
        guardarProducto(nuevoProducto);
        io.emit("Nuevo producto agregado", nuevoProducto)
    });

    socket.on("disconnect", () => {
        console.log("El cliente se desconectó")
    })
})

