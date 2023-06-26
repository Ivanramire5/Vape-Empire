
import { ProductManager } from './ProductManager.js';

let miPrimerStore = new ProductManager("./productos.json");
let miSegundaStore = new ProductManager("./productosVapeo.json");

miSegundaStore
    .deleteProductById("d3068e07-b07b-49a6-b083-1d2b09f119aa")
    .then((dato) => console.log("El resultado eliminado es:", dato));