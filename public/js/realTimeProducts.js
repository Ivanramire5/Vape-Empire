
const socket = io()

socket.emit("connection", "nuevo cliente en linea")

socket.on("updateProducts", (data) => {
  let contenedor = document.getElementById("contenedor")
  contenedor.innerHTML = ""
  data.forEach((producto) => {
    let nuevoDiv = document.createElement("div")
    nuevoDiv.innerHTML += `<div class="card">
    <div class="divImage>
      <img src="${producto.thumbnail}" class="productImg" alt="${producto.title}">
    </div>
    <div class="cuerpoTarjeta">
      <h4 class="tituloTarjeta">${producto.title}</h4>
      <p class="subtituloTarjeta">${producto.description}</p>
    </div>
    <ul class="tarjetaProducto">
      <li class="productosListados">${producto.code}</li>
      <li class="productosListados">${producto.price}</li>
      <li class="productosListados">Stock: ${producto.stock}</li>
    </ul>
    <div class="tarjetaProducto">
      <li class="productosListados">${producto.status}</li>
      <li class="productosListados">${producto.category}</li>
      <button type="button" class="btnEliminar" id="${producto._id}">
        Delete Product
      </button>
    </div>
    `
    let botonEliminador = document.getElementById(`${producto._id}`)
    botonEliminador.addEventListener("click", eliminarProducto)
  })
})
let agregarAlFormulario = document.getElementById("productForm")

agregarAlFormulario.addEventListener("submit", (e) => {
  e.preventDefault()
  let title = document.getElementById("nombre").value
  let description = document.getElementById("description").value
  let code = document.getElementById("code").value
  let price = document.getElementById("price").value
  let stock = document.getElementById("stock").value
  let category = document.getElementById("category").value
  let thumbnail = document.getElementById("thumbnail").value
  socket.emit("new-product",{title,description,code,price,stock,category,thumbnail,status: true, quantity: 1})
})

function borrarProducto(e){
  let id = e.target.id
  socket.emit("delete-product",id)
}