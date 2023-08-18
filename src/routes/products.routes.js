
import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js"

const router = Router()

//Tomar productos
router.get("/",async(solicitud,respuesta)=>{
    const {limit = 10, page = 1, sort, query} = solicitud.query
    const results = await ProductsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    let prevLink = results.hasPrevPage ? `http://localhost:4040/products/?page=${+page-1}&limit=${limit}&query=${query}&sort=${sort}` : null
    let nextLink = results.hasNextPage ? `http://localhost:4040/products/?page=${+page+1}&limit=${limit}&query=${query}&sort=${sort}` : null
    results.prevLink = prevLink
    results.nextLink = nextLink
    respuesta.send(results)
})
//Tomar producto por id
router.get("/:pid",async(solicitud,respuesta)=>{
    const {pid} = solicitud.params
    let producto = await ProductsModel.findById(pid)
    return respuesta.JSON({message: "Producto seleccionado", producto : producto})
})
//Modificar un producto
router.put("/:pid",async(solicitud,respuesta)=>{
        const {pid} = solicitud.params
        const {title,description,code,price,stock,category,thumbnail} = solicitud.body
        if(!title || !description || !code || !price || !stock || !category || !thumbnail){
            return res.status(500).JSON({message : "Faltan datos"})
        }else{
            const producto = {
                title : title,
                description: description,
                code : code,
                price : +price,
                status : true,
                stock : +stock,
                category : category,
                thumbnail : thumbnail
            }
            let result = await ProductsModel.findByIdAndUpdate(pid,producto)
            return respuesta.JSON({message : "Producto modificado correctamente", data : result})
        }
})
//Borrar un producto
router.delete("/:pid",async(solicitud,respuesta)=>{
    const {pid} = solicitud.params
    let result = await ProductsModel.findByIdAndDelete(pid)
    if(result === null){
        return respuesta.status(404).JSON({message: "Producto no encontrado"})
    }else{
        return respuesta.JSON({message: "Producto eliminado", data: result})
    }
})
//Agregar un producto
router.post("/agregarProducto",async(solicitud,respuesta)=>{ 
    const {title,description,code,price,stock,category,thumbnail} = solicitud.body
    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        return respuesta.status(500).JSON({message : "Faltan datos"})
    }else{
        const productoNuevo = {
            title : title,
            description : description,
            code : code,
            price : +price,
            status : true,
            stock : +stock,
            category : category,
            thumbnail : thumbnail
        }
        let result = await ProductsModel.insertMany([productoNuevo])
        return respuesta.status(201).JSON({message: "Producto agregado exitosamente", data : result})
    }
})


export default router