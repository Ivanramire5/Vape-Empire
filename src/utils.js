//Importaciones
import bcrypt from "bcrypt";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Exportaciones
export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, savedPassword) => {
    console.log({ "cloud password": savedPassword, loginPassword: password });
    return bcrypt.compareSync(password, savedPassword);
};



export default __dirname;
