import { Router, response } from "express";
import { ProductManager } from "../classes/ProductManager.js"

const router = Router();
let productos = [];
const productManager = new ProductManager("./src/products.json")


router.get("/", async (solicitud, respuesta) => {
    const { limit } = solicitud.query;
    try {
        let response = await productManager.getProducts();
        if (limit) {
            let temporalArray = response.filter((dat, index) => index < limit);
            respuesta.json({data: temporalArray, limit: limit, quantity: temporalArray.length });
        } else {
            respuesta.json({ data: response, limit: false, quantity: response.length });
        }
    } catch (err) {
        console.log(err)
    }
})

router.get("/:pid", async (solicitud, respuesta) => {
    const { pid } = solicitud.params;

    let product = await productManager.getProductsById(parseInt(pid));

    if (product) {
        respuesta.json({ message: "success", data: product })
    } else {
        respuesta.json({
            message: "El producto que usted busca no existe"
        })
    }
})

router.post("/", async (solicitud, respuesta) => {
    const { title, description, price, thumbnails, code, status, stock, category, } = respuesta.body;
    const product = {};
    if (!title || !description || !price || !code || !stock || !category) {
        respuesta.json({ message: "Faltan datos"})
    } else {
        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.status = !status || typeof status !== "boolean" ? true : status;
        product.category = category;
        product.thumbnails = !thumbnails ? "" : thumbnails;

        try {

            const respuesta = await productManager.addProduct(product);
            respuesta.json({ message:"Producto agregado correctamente", data: respuesta, })
        } catch (error) {
            console.log(error);
            respuesta.status(404).json({
                message: "Error interno del servidor"
            })
        }
    }
})


router.put("/:pid", async (solicitud, respuesta) => {
    const { pid } = respuesta.params;
    const {title, description, code, price, status, stock, category, thumbnails} = respuesta.body;
    const productTemporal = {};

    let product = await productManager.getProductsById(parseInt(pid));

    if (product) {
        if ( !title, !description, !price, !thumbnails, !code, !status, !stock, !category) {
            respuesta.json({ message: "faltan datos" })
        }

        productTemporal.title = title
        productTemporal.description = description
        productTemporal.code = code
        productTemporal.price = price
        productTemporal.status = status
        productTemporal.stock = stock
        productTemporal.category = category
        productTemporal.thumbnails = thumbnails

        let result = await productManager.updateProductById(parseInt(pid), productTemporal);
        
        respuesta.json({ message: "Producto actualizado correctamente", data: result })
    } else {
        respuesta.json({
            message: "El producto que usted busca no existe, no se puede actualizar"
        })
    }
});

router.delete("/:pid", async (solicitud, respuesta) => {
    const { pid } = solicitud.params;
    let product = await productManager.getProductsById(parseInt(pid));
    if (!product) {
        respuesta.json({
            message: "El producto que usted busca no existe, no se lo puede eliminar",
        })
    } else {
        let result = await productManager.deleteProductById(parseInt(pid));
        respuesta.json({ message: "Producto eliminado", data: result })
    }
})

export default router;