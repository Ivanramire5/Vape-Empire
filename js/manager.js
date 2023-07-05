import { ProductManager } from "./ProductManager";
import { __dirname } from "./utils.js"

let miPrimerStore = new ProductManager("./productosVapeo.json");
miPrimerStore.getProducts().then((data) => console.log(data))

miSegundaStore
    .deleteProductById("d3068e07-b07b-49a6-b083-1d2b09f119aa")
    .then((data) => console.log("El resultado eliminado es:", data));