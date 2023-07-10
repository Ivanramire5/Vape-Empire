import express from "express";
import productsRouter from "./router/products.router.js"
import cartRouter from "./router/cart.router.js";
import  __dirname  from "./utils.js";


const app = express();
const PORT = process.env.PORT || 4000;
let productos = [];


app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter)

const servidorConectado = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});

servidorConectado.on("error", (error) => {
    console.log(error.message)
})