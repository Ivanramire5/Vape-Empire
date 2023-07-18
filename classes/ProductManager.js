
import utils from "../utils.js";

const socket = socket.io()

export class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }
    async addProduct(product) {
        const { title, description, price, category, thumbnails, code, stock, status } = product;
        if (
            title == undefined ||
            description == undefined ||
            price == undefined ||
            code == undefined ||
            stock == undefined ||
            status == undefined ||
            category == undefined
        ) {
            throw new Error(
                "Todos los campos son obligatorios" 
            );
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
            id: data?.length ? data.length + 1 : 1,
            title,
            description,
            price,
            thumbnails,
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

    
    export default  ProductManager