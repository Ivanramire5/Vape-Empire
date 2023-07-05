
import utils from "./utils.js";
import crypto from "crypto";

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        if (
            title == undefined ||
            description == undefined ||
            price == undefined ||
            thumbnail == undefined ||
            code == undefined ||
            stock == undefined
        ) {
            throw new Error("Uno de los datos es incorrecto. Corrijalo");
        }
  
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
        } catch (error) {
            console.log(error);
        }
  
        let codigoExiste = this.products.some((dato) => dato.code == code);
  
        if (codigoExiste) {
            throw new Error("El codigo que usted está intentando usar ya existe. Verifique los datos por favor");
        } else {
            const productoNuevo = {
            id: crypto.randomUUID(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.products.push(productoNuevo);
        try {
            await utils.writeFile(this.path, this.products);
        } catch (error) {
            console.log(error);
        }
    }
}
  
    async getProducts() {
        try {
            let data = await utils.readFile(this.path);
            this.products = data;
            return data?.length > 0 ? this.products : "aun no hay datos registrados";
        } catch (error) {
            console.log(error);
        }
    }
  
    async getProductsById(id) {
        try {
            let data = await utils.readFile(this.path);
            this.products = data?.length > 0 ? data : [];
            let producto = this.products.find((dato) => dato.id === id);
    
            if (producto !== undefined) {
                return producto;
            } else {
                return "no existe el producto que usted busca";
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    async updateProductById(id, data) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];
  
            let productoIndex = this.products.findIndex((dato) => dato.id == id);
            if (productoIndex !== -1) {
                this.products[productoIndex] = {
                ...this.products[productoIndex],
                ...data,
            };
            await utils.writeFile(this.path, products);
            return {
                mensaje: "updated product",
                producto: this.products[productoIndex],
            };
            } else {
                return { mensaje: "El producto que usted busca no existe" };
            }
        } catch (error) {
            console.log(error);
        }
    }
  
    async deleteProductById(id) {
        try {
            let products = await utils.readFile(this.path);
            this.products = products?.length > 0 ? products : [];
            let productoIndex = this.products.findIndex((dato) => dato.id === id);
            if (productoIndex !== -1) {
                let product = this.products[productoIndex];
                this.products.splice(productoIndex, 1);
                await utils.writeFile(this.path, products);
                return { mensaje: "deleted product", producto: product };
            } else {
                return { mensaje: "this product doesn't exist" };
            }
            } catch (error) {
                console.log(error);
            }
        }
    }

    let directorDeProductos = new ProductManager("./productosVapeo.json");
    console.log(directorDeProductos.getProducts());
    console.log(
        await directorDeProductos.addProduct(
            "tested product",
            "this is a tested product",
            300,
            "no image",
            123456,
            40,
        )
    );
    console.log(await directorDeProductos.getProducts());
    console.log(await directorDeProductos.getProductsById(0));
    console.log(
        await directorDeProductos.updateProductById({
            title: "this is a title",
            description: "this is a product description",
            price: 300,
            thumbnail: "no image",
            code: 123456,
            stock: 40,
            id: 0,
        })
    );
    console.log(await directorDeProductos.getProducts());
    console.log(await directorDeProductos.deleteProductById(0));
  
    export default {
        ProductManager,
    };