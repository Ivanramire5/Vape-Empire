import { Router } from "express";
import CartsModel from "../dao/models/carts.model.js";
import ProductsModel from "../dao/models/products.model.js";

const router = Router()
//Crear carrito
router.post("/",async(req,res)=>{
    const carrito = {
        products : []
    }
    let result = await CartsModel.insertMany([carrito])
    return res.send({message : "Carrito creado correctamente", data: result})
})
//Tomar carrito por id
router.get("/:cid",async(req,res)=>{
    const {cid} = req.params
    let result = await CartsModel.findOne({_id: cid})
    return result.json({message: "Carrito seleccionado", data: result})
})
//Tomar carrito por id y sumarle un producto
router.post("/:cid/product/:pid",async(req,res)=>{
    const { cid, pid } = req.params;
    let carrito = await CartsModel.findOne({_id: cid});
    console.log("ejemplo1", pid)
    if (carrito) {
        const productoEnCarrito = carrito.products.find(producto => producto.product.toString() === pid);
        if (productoEnCarrito) {
            productoEnCarrito.quantity++;
        } else {
            carrito.products.push({
                product: pid,
                quantity: 1
            });
        }
        const postEnCart = await carrito.save();
        return res.send({ message: "Producto agregado", data: postEnCart });
    } else {
        return res.send({ message: "Carrito no encontrado" });
    }
    
})

//Eliminar del carrito el producto seleccionado
router.delete("/:cid/products/:pid",async(req,res)=>{
    const {cid,pid} = req.params
    let carrito = await CartsModel.findOne({_id: cid})
    let products = carrito.products
    let producto = products.findIndex((producto)=>producto.product.id === pid)
    if(producto !== -1){
        products.splice(producto,1)
        let res = await CartsModel.findByIdAndUpdate(cid,carrito)
        return res.json({message: "Producto eleminado correctamente del carrito", data: res})
        }else{
            return res.status(404).json({message: "Producto no encontrado"})
        }
    })

//Actualizar el carrito con un arreglo de productos especificado
router.put("/:cid",async(req,res)=>{
    const {cid} = req.params
    const {data} = req.body
    let carrito = await CartsModel.findById(cid)
    carrito.products = data
    let carritoNuevo = await CartsModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "Carrito actualizado", data: carritoNuevo})
})

//Actualizar cantidad de ejemplares del producto seleccionado, del carrito especificado
router.put("/:cid/products/:pid",async(req,res)=>{
        const {cid,pid} = req.params
        const {cantidad} = req.body
        let carrito = await CartsModel.findOne({_id: cid})
        let products = carrito.products
        let producto = products.findIndex((producto)=>producto.product.id === pid)
        if(producto !== -1){
            products[producto].product.quantity = cantidad
            let res = await CartsModel.findByIdAndUpdate(cid,carrito)
            return res.json({message: "Cantidad de ejemplares actualizada", data: res})
            }else{
                return res.status(404).json({message: "Producto no encontrado"})
            }
        })

//Eliminar todos los productos del carrito
router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    let carrito = await CartsModel.findById(cid)
    carrito.products = []
    let deleteCart = await CartsModel.findByIdAndUpdate(cid,carrito)
    return res.json({message: "Carrito vacio", data: deleteCart})
})

export default router