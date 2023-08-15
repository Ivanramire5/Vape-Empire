
import fs from "fs";

class Cart {
    constructor() {
        this.products = []
    }
}

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async addCart() {
        try {
            const carrito = new Cart()
            let datosCarrito = await fs.promises.readFile(this.path, "utf-8");
            let dataCarritoParse = JSON.parse(datosCarrito);
            const data = dataCarritoParse ? [...dataCarritoParse, { id: dataCarritoParse.length + 1, ...carrito }]
            : [{ ...carrito, id: dataCarritoParse.length + 1 }]
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2))
        } catch (error) {
            console.log("Hubo un error")
        }
    }

    async addProductToCart(carritoId, productoId) {
        let datosCarrito = await fs.promises.readFile(this.path, "utf-8");
        let dataCarritoParse = JSON.parse(datosCarrito);
        let carrito = dataCarritoParse.find((carrito) => carrito.id === parseInt(carritoId));

        if (carrito) {
            const productoIndex = carrito.products.findIndex((product) => product.id === productoId) 
            if (productoIndex !== -1) {
                carrito.products[productoIndex].quantity++;
                const carritoIndex = dataCarritoParse.findIndex (
                    (carrito) => carrito.id === parseInt(carritoId)
                );
                dataCarritoParse[carritoIndex] = carrito;
                await fs.promises.writeFile (
                    this.path, JSON.stringify(dataCarritoParse, null, 2)
                )
            } else {
                let product = { id: productoId, quantity: 1 };
                carrito.products.push(product);
                dataCarritoParse.push(carrito);
                
                await fs.promises.writeFile (this.path, JSON.stringify(dataCarritoParse, null, 2)
                )
            }
        } else {
            console.log("Carrito no encontrado")
        }
    }

    async getCartById(id) {
        try {
            let datosCarrito = await fs.promises.readFile(this.path, "utf-8")
            let dataCarritoParse = JSON.parse(datosCarrito);
            let carrito = dataCarritoParse.find((carrito) => carrito.id === id);
            if (carrito) {
                return carrito;
            } else {
                console.log(`No existe el carrito con el ID ${id}`)
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }
}


export default CartManager