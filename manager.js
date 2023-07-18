import { ProductManager } from "./classes/ProductManager.js";
import { __dirname } from "./utils.js"

console.log("dirname", __dirname);

let miPrimerStore = new ProductManager("./productos.json");
miPrimerStore.getProducts().then((data) => console.log(data))

miSegundaStore
    .deleteProductById("d3068e07-b07b-49a6-b083-1d2b09f119aa")
    .then((data) => console.log("El resultado eliminado es:", data));