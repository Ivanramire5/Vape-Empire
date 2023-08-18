import { Router } from "express";
import CartsModel from "../dao/models/carts.model.js";
import ProductsModel from "../dao/models/products.model.js";

const router = Router()
//Crear carrito
router.post("/",async(solicitud,respuesta)=>{
    const carrito = {
      products : []
    }
    let result = await CartsModel.insertMany([carrito])
    return result.JSON({message : "Carrito creado correctamente", data: respuestault})
})
//Tomar carrito por id
router.get("/:cid",async(solicitud,respuesta)=>{
    const {cid} = solicitud.params
    let result = await CartsModel.findOne({_id: cid})
    return result.JSON({message: "Carrito seleccionado", data: respuestault})
})
//Tomar carrito por id y sumarle un producto
router.post("/:cid/product/:pid",async(solicitud,respuesta)=>{
    const { cid, pid } = solicitud.params;
    let carrito = await CartsModel.findOne({_id:cid});
  
    if (carrito) {
        const productoEnCarrito = carrito.products.find(producto => producto.product.id === pid);
        if (productoEnCarrito) {
            productoEnCarrito.quantity++;
        } else {
            const producto = await ProductsModel.findById(pid);
            carrito.products.push({
                product: producto._id,
                quantity: 1
            });
        }
        const respuestault = await carrito.save();
        return respuesta.JSON({ message: "Producto agregado", data: respuestault });
    } else {
        return respuesta.status(404).JSON({ message: "Carrito no encontrado" });
    }
})

//Eliminar del carrito el producto seleccionado
router.delete("/:cid/products/:pid",async(solicitud,respuesta)=>{
    const {cid,pid} = solicitud.params
    let carrito = await CartsModel.findOne({_id: cid})
    let products = carrito.products
    let producto = products.findIndex((producto)=>producto.product.id === pid)
    if(producto !== -1){
        products.splice(producto,1)
        let respuestault = await CartsModel.findByIdAndUpdate(cid,carrito)
        return respuesta.JSON({message: "Producto eleminado correctamente del carrito", data: respuestault})
        }else{
            return respuesta.status(404).JSON({message: "Producto no encontrado"})
        }
    })

//Actualizar el carrito con un arreglo de productos especificado
router.put("/:cid",async(solicitud,respuesta)=>{
    const {cid} = solicitud.params
    const {data} = solicitud.body
    let carrito = await CartsModel.findById(cid)
    carrito.products = data
    let respuestault = await CartsModel.findByIdAndUpdate(cid,carrito)
    return respuesta.JSON({message: "Carrito actualizado", data: respuestault})
})

//Actualizar cantidad de ejemplarespuesta del producto seleccionado, del carrito especificado
router.put("/:cid/products/:pid",async(solicitud,respuesta)=>{
        const {cid,pid} = solicitud.params
        const {cantidad} = solicitud.body
        let carrito = await CartsModel.findOne({_id: cid})
        let products = carrito.products
        let producto = products.findIndex((producto)=>producto.product.id === pid)
        if(producto !== -1){
            products[producto].product.quantity = cantidad
            let respuestault = await CartsModel.findByIdAndUpdate(cid,carrito)
            return respuesta.JSON({message: "Cantidad de ejemplarespuesta actualizada", data: respuestault})
            }else{
                return respuesta.status(404).JSON({message: "Producto no encontrado"})
            }
        })

//Eliminar todos los productos del carrito
router.delete("/:cid",async(solicitud,respuesta)=>{
    const {cid} = solicitud.params
    let carrito = await CartsModel.findById(cid)
    carrito.products = []
    let respuestault = await CartsModel.findByIdAndUpdate(cid,carrito)
    return respuesta.JSON({message: "Carrito vacio", data: respuestault})
})

export default router