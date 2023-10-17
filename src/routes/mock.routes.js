
import { Router } from "express";
import { createRandomProducts } from "../utils/utils.js"

const MockRoute = Router()

MockRoute.get("/", async (req, res) => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(createRandomProducts())
    }
    res.send({status: "success", payload: products})
})

export default MockRoute