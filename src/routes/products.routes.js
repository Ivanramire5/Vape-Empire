
import { Router } from "express";
import productManager from "../memory/products.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJWT.js";

const ProductsRoute = Router()
const Manager = new productManager()

ProductsRoute.get("/:code", async (req, res) => {
    const code = req.params.code;
    const product = await Manager.getProductByCode(code);
    res.json(product);
});
  //getProducts
ProductsRoute.get("/", async (req, res) => {
    const products = await Manager.getProducts();
    res.json(products);
});
  //addProduct
ProductsRoute.post(
    "/addnewProduct",
    [verifyToken, isAdmin],
    async (req, res) => {
        const product = req.body;
        const newProduct = await Manager.addProduct(product);
        res.json(newProduct);
    }
);
  // updateProductByCode
ProductsRoute.put("/:code", [verifyToken, isAdmin], async (req, res) => {
    const code = req.params.code;
    const modified = req.body;
    const product = await Manager.updateProductByCode(code, modified);
    res.json(product);
});
  //deleteProduct
ProductsRoute.delete("/:code", [verifyToken, isAdmin], async (req, res) => {
    const code = req.params.code;
    const product = await Manager.deleteProduct(code);
    res.json(product);
});

export default ProductsRoute