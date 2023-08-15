
import fs from 'fs';

class productManagers {
    constructor(path) {
        this.path = path
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path,JSON.stringify([]))
        }
    }

    async addProduct(product){
        try{
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
                throw new Error("Todos los campos deben ser obligatorios")
            }else{
                let arrayProductos = fs.readFileSync(this.path,"utf-8")
                let productos = JSON.parse(arrayProductos)
                let id = productos.length + 1
                product.id = id
            }
            let arrProductos = fs.readFileSync(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            productos.push(product)
            fs.writeFileSync(this.path,JSON.stringify(productos))
            console.log("Producto agregado")
        }catch(error){
            console.log(error)
        }
    }

    async getProductos(){
        try{
        let arrProductos = await fs.promises.readFile(this.path,"utf-8")
        let productos = JSON.parse(arrProductos)
        return productos
        }catch(error){
            return error
        }
    }

    async getProductById(id){
        try{
            let arrProductos = await fs.promises.readFile(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            return productos.find((product)=>product.id===id) || "Not found"
            }catch(error){
            return error
        }
    }

    async updateProduct(id,campo,dato){
        try{
            let arrProductos = await fs.promises.readFile(this.path,"utf-8")
            let productos = JSON.parse(arrProductos)
            let productoIndice = productos.findIndex((product)=>product.id===id)
            if(productoIndice === -1){
                return new Error("Producto no encontrado")
            }else{
                productos[productoIndice][campo] = dato
                await fs.promises.writeFile(this.path,JSON.stringify(productos))
            }
            }catch(error){
            return error
        }
    }

    async deleteProduct(id){
        try{
        let arrProductos = await fs.promises.readFile(this.path,"utf-8")
        let productos = JSON.parse(arrProductos)
        let producto = productos.find((product)=>product.id===id)
        if(producto == undefined){
            console.log(new Error("Producto no encontrado"))
        }else{
            let newProductos = productos.filter((product)=>product.id!==producto.id)
            await fs.promises.writeFile(this.path,JSON.stringify(newProductos))
            console.log("Producto eliminado")
        }
        }catch(error){
            console.log(error)
        }
    }
}

let product1 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product2 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product3 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product4 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product5 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product6 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product7 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product8 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product9 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
let product10 = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
}
const manager = new productManagers("products.json")

manager.addProduct(product1)
manager.addProduct(product2)
manager.addProduct(product3)
manager.addProduct(product4)
manager.addProduct(product5)
manager.addProduct(product6)
manager.addProduct(product7)
manager.addProduct(product8)
manager.addProduct(product9)
manager.addProduct(product10)

export default  productManagers;