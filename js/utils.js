
import fs from "fs";

async function readFile(file) {
    try {
        let resultado = await fs.promises.readFile(file, "utf-8");
        let dato = await JSON.parse(resultado);
        return dato;
    } catch (error) {
        console.log(error);
    }
}

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(file, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
    }
}

async function deleteFile(file) {
    try {
        await fs.promises.unlink(file);
        return true;
    } catch (error) {
        console.log(error);
    }
}

export default { readFile, writeFile, deleteFile };