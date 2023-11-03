
import mongoose from "mongoose"
import User from "../dao/mongo/models/userSchema.js"
import Assert from "assert"

//Vamos a usar mocha en este test

const connection = mongoose.connect(`mongodb+srv://ivanr4amire5:y9tN2DQWF1a5tQmH@database1.hng81to.mongodb.net/e-commerce`)

const Assert = Assert.strict

describe("Testing del User Dao", () => {
    before(function() {
        this.userSchema = new User()
    })
    beforeEach(function() {
        this.timeout(6000);
    })
    it("Es capaz de crear un usuario de una base de datos", () => {
    
    })
})
