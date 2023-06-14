
class ProductManager {
    constructor() {
        this.products = []
    }

    #newId = 0;

    getProducts() {
        return this.products
    }
    addProducts({title, description, price, thumbnail, code, stock}) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return "Uno de los datos es incorrecto. Reintentelo"
        }
        const comprobarCodigo = this.products.find(product => product.code === code);

        if (comprobarCodigo) {
            return "el producto ya fue agregado a la lista"
        }

        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        this.products.push({...newProduct, id: this.#newId += 1})
        return "Producto agregado correctamente"
    }

    getProductsById(id) {
        const productsId = this.products.find((products) => products.id === id)

        if (!productsId) {
            return "No se encontró"
        }
        return productsId
    }
}

const productsTest = new ProductManager()


const product1 = {
    title: "Tested product 1",
    description: "Este es un tested product",
    price: 300,
    thumbnail: "No image",
    code: "abcdefg123456",
    stock: 30
}

const product2 = {
    title: "Tested product 2",
    description: "Este es un tested product",
    price: 300,
    thumbnail: "No image",
    code: "abcdefg123456",
    stock: 40
}

const product3 = {
    title: "Tested product 3",
    description: "Este es un tested product",
    price: 300,
    thumbnail: "No image",
    code: "abcdefg123456",
    stock: 10
}

console.log(productsTest.getProducts())

console.log(productsTest.addProducts(product1))
console.log(productsTest.addProducts(product2))
console.log(productsTest.addProducts(product3))

console.log("Producto identificado mediante su id:", productsTest.getProductsById(1))
console.log(productsTest.getProductsById(5))