

import { TOYSDAO } from "../dao/index.js";
async function saveToy(req, res) {
    const toy = req.body;
    await TOYSDAO.save(toy);
    res.send(toy);
}

async function getAllToys(req, res) {
    const toys = await TOYSDAO.getAll();
    res.send(toys);
}

export { saveToy, getAllToys };