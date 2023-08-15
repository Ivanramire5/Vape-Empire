import fs from "fs"; 
import path from "path"; 
import { __dirname } from "../utils.js"; 

// Exportamos la función para obtener la lista de productos
export function obtenerListaDeProducts() {
    const filePath = path.join(__dirname, './data/products.json'); // Creamos la ruta al archivo products.json usando path.join
    const fileContent = fs.readFileSync(filePath, 'utf-8'); // Leemos el contenido del archivo
    const data = JSON.parse(fileContent); // Parseamos el contenido JSON a un objeto

    return data; 
} 

// Exportamos la función para guardar un producto en la lista
export function guardarProducto(product) {
    const filePath = path.join(__dirname, './data/products.json'); // Creamos la ruta al archivo products.json
    const fileContent = fs.readFileSync(filePath, 'utf-8'); // Leemos el contenido del archivo
    const data = JSON.parse(fileContent); // Parseamos el contenido JSON a un objeto

    data.push(product); // Agregamos el nuevo producto al arreglo de datos
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8'); // Escribimos los datos actualizados en el archivo
} 

// Exportamos la función para eliminar un producto por su ID
export function eliminarProducto(pid) {
    const filePath = path.join(__dirname, './data/products.json'); // Creamos la ruta al archivo products.json
    const fileContent = fs.readFileSync(filePath, 'utf-8'); // Leemos el contenido del archivo
    const data = JSON.parse(fileContent); // Parseamos el contenido JSON a un objeto

    const index = data.findIndex(product => product.id === pid); // Encontramos el índice del producto a eliminar
    data.splice(index, 1); // Eliminamos el producto del arreglo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8"); // Escribimos los datos actualizados en el archivo
} 
