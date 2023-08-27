
const socket = io();

socket.emit("connection", "nuevo cliente conectado");

document.getElementById("productForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const productName = document.getElementById("productName").value;
  const productTitle = document.getElementById("productTitle").value;
  const productDescription = document.getElementById("productDescription").value;
  const productPrice = document.getElementById("productPrice").value;
  const productThumbnail = document.getElementById("productThumbnail").value;

  console.log(
    "Nuevo producto agregado:",
    productName,
    productTitle,
    productDescription,
    productPrice,
    productThumbnail
  );

  socket.emit("agregarProducto", {
    name: productName,
    title: productTitle,
    description: productDescription,
    price: productPrice,
    thumbnail: productThumbnail,
  });


  document.getElementById("productName").value = "";
  location.reload();
});


socket.on("initialProductList", (productList) => {
  updateProductList(productList);
});


socket.on("nuevoProductoAgregado", (newProduct) => {
  const productList = document.getElementById("productList");
  const li = document.createElement("li");
  li.textContent = newProduct.name;

  productList.appendChild(li);
});



function updateProductList(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((products) => {
    const li = document.createElement("li");
    li.textContent = products.name;
    productList.appendChild(li);
  });
}




function updateProductList(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach((products) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${products.name}</h3>
      <p>Título: ${products.title}</p>
      <p>Descripción: ${products.description}</p>
      <p>Precio: ${products.price}</p>
      <p>Thumbnail: ${products.thumbnail}</p>
    `;
  });

    productList.appendChild(li);
}

function addToCart(id) {
  console.log("tenemos el id desde  el backend", id);
}

