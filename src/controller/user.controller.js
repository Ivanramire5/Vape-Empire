
import { USERSDAO } from "../dao/index.js";

const saveUser = async (req, res) => {
    const user = req.body;
    await USERSDAO.save(user);
    res.send(user);
};

const getAllUsers = async (req, res) => {
    const users = await USERSDAO.getAll();
    res.send(users);
};

export { saveUser, getAllUsers };