import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js";
import CartsModel from "../dao/models/carts.model.js";

const router = Router()

router.get("/",async (solicitud,respuesta)=>{
    const {limit = 10, page = 1, sort, query} = solicitud.query
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = await ProductsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    respuesta.render("home",{Title: "Nuestros productos", 
    products: docs,  
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    limit,
    sort,
    query,
})
})

router.get("/realTimeProducts",(solicitud,respuesta)=>{
    respuesta.render("realTimeProducts",{title: "Productos en tiempo real", script: "index.js"})
})

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

router.get("/carts/:cid",async(solicitud,respuesta)=>{
    const { cid } = solicitud.params;
    try {
        let carrito = await CartsModel.findOne({_id: cid }).lean()
        if (carrito) {
            let products = carrito.products;
            console.log(products)
            respuesta.render("carrito", { title: "Carrito", products: products });
        } else {
            respuesta.send("Carrito no encontrado");
        }
    } catch (err) { 
        console.log(err); 
        respuesta.send("Error al cargar el carrito");
    }
})

export default router 