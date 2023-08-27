
import fs from 'fs';

class productManagers {
    constructor(path) {
        this.path = path
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path,json.stringify([]))
        }
    }

    async addProduct(product){
        try{
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
                throw new Error("Todos los campos deben ser obligatorios")
            }else{
                let arrayProducts = fs.readFileSync(this.path,"utf-8")
                let products = json.parse(arrayProducts)
                let id = products.length + 1
                product.id = id
            }
            let arrProducts = fs.readFileSync(this.path,"utf-8")
            let products = json.parse(arrProducts)
            products.push(product)
            fs.writeFileSync(this.path,json.stringify(products))
            console.log("Producto agregado")
        }catch(error){
            console.log(error)
        }
    }

    async getProducts(){
        try{
        let arrProducts = await fs.promises.readFile(this.path,"utf-8")
        let products = json.parse(arrProducts)
        return products
        }catch(error){
            return error
        }
    }

    async getProductById(id){
        try{
            let arrProducts = await fs.promises.readFile(this.path,"utf-8")
            let products = json.parse(arrProducts)
            return products.find((product)=>product.id===id) || "Not found"
            }catch(error){
            return error
        }
    }

    async updateProduct(id,campo,dato){
        try{
            let arrProducts = await fs.promises.readFile(this.path,"utf-8")
            let products = json.parse(arrProducts)
            let productoIndice = products.findIndex((product)=>product.id===id)
            if(productoIndice === -1){
                return new Error("Producto no encontrado")
            }else{
                products[productoIndice][campo] = dato
                await fs.promises.writeFile(this.path,json.stringify(products))
            }
            }catch(error){
            return error
        }
    }

    async deleteProduct(id){
        try{
        let arrProducts = await fs.promises.readFile(this.path,"utf-8")
        let products = json.parse(arrProducts)
        let producto = products.find((product)=>product.id===id)
        if(producto == undefined){
            console.log(new Error("Producto no encontrado"))
        }else{
            let newProducts = products.filter((product)=>product.id!==producto.id)
            await fs.promises.writeFile(this.path,json.stringify(newProducts))
            console.log("Producto eliminado")
        }
        }catch(error){
            console.log(error)
        }
    }
}



export default  productManagers;