import { Router } from "express";
import ProductsModel from "../dao/models/products.model.js";
import CartsModel from "../dao/models/carts.model.js";

const router = Router()

router.get("/",async (req,res)=>{
    const {limit = 10, page = 1, sort, query} = req.query
    const {docs,hasPrevPage,hasNextPage,nextPage,prevPage} = await ProductsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    res.render("home",{Title: "Nuestros productos", 
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

router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts",{title: "Productos en tiempo real", script: "index.js"})
})

router.post("/agregarProducto",async(req,res)=>{
    const {title,description,code,price,stock,category,thumbnail} = req.body
    if(!title || !description || !code || !price || !stock || !category || !thumbnail){
        return res.status(500).JSON({message : "Faltan datos"})
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
        return res.status(201).JSON({message: "Producto agregado exitosamente", data : result})
    }
})

router.get("/carts/:cid",async(req,res)=>{
    const { cid } = req.params;
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