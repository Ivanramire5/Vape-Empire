
import { Router } from "express";

const loggerTest = Router()

loggerTest.get("/", (req, res) => {
    req.logger.info("Produccion")
    res.send({message: "Logger test"})
})

export default loggerTest