
import mongoose from "mongoose"
import Users from "../src/dao/mongo/UserMongooseDao.js"
import userSchema from "../src/dao/mongo/models/userSchema.js"
import Assert from "assert"

//Vamos a usar mocha en este test

const assert = Assert.strict;

mongoose.connect(
    `mongodb+srv://ivanr4amire5:y9tN2DQWF1a5tQmH@database1.hng81to.mongodb.net/e-commerce`
);

describe("Testing del User Dao", () => {
    it("Obtener usuarios de la base de datos", async () => {
        const users = await userSchema.find()
        console.log(users)
        assert.strictEqual(Array.isArray(users), true);
    })

    it("Es capaz de crear un usuario de una base de datos", async () => {
        const user = {
            first_name: "Lionel",
            last_name: "Messi",
            email: "Leomessi10@gmail.com",
            password: "1234",
        }
        const users = new Users()
        const result = await users.save(user); 
        console.log(result)
        assert.notEqual(result, null);
    });

    it("Obtenemos un usuario", async () => {
        const email = "Leomessi10@gmail.com";
        const users = new Users()
        const result = await users.getBy({ email: email});
        assert.notEqual(result, null)
    })
})
