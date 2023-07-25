import fs from "fs";
import path from "path";
import  __dirname  from "../utils.js";

export function obtenerListaDeProducts() {
    const filePath = path.join(__dirname, './products.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    return data;
}

export function guardarProducto(products) {
    const filePath = path.join(__dirname, './products.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent)

    data.push(products)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function eliminarProducto (pid) {
    const filePath = path.join(__dirname, './products.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    const index = data.findIndex(products => products.id === pid)
    data.splice(index, 1)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8")
}