
import mongoose from "mongoose";
import chai from "chai"
import Products from "../src/dao/mongo/ProductMongooseDao.js"
import productSchema from "../src/dao/mongo/models/productSchema.js";
import { fileLoader } from "ejs";

//Vamos a usar chai para hacer este test

mongoose.connect(
    `mongodb+srv://ivanr4amire5:y9tN2DQWF1a5tQmH@database1.hng81to.mongodb.net/e-commerce`
);

const expect = chai.expect;

describe("Estas pruebas evaluan nuestros datos", () => {
    before(function() {});
    beforeEach(function() {
        this.timeout(5000)
    })
    it("2 productos en oferta con un valor de 8 dolares deberian valer 14 dolares", async () => {
        expect(8 + 8 - 2).to.be.equal(14)
        .and.to.be.a("number");
    })
    it("Obtener los productos de la base de datos", async () => {
        const products = await productSchema.find()
        console.log(products)
        expect(products).to.be.an("array");
        //expect(Array.isArray(products)).to.be.ok
    });
    it("Eliminamos el producto creado", async () => {
        const products = new Products();
        const filteredProduct = await products.getBy({ description: "Liquido sabor lemon pie" })
        if (filteredProduct) {
            const result = await products.delete(filteredProduct._id);
            console.log(result);
            if (result === null) {
                console.log("No se pudo eliminar el producto");
            } else {
                expect(result).to.be.ok;
            }
        } else {
            console.log("Este producto no existe")
        }
    });
    it("Creamos un producto con todos sus campos en una base de datos", async () => {
        const product = new Products({
            title: "Dinner Lady",
            description: "Liquido sabor lemon pie",
            category: "liquidos",
            thumbnail: "lady.jpg",
            stock: 40,
            code: "240gds33421",
            marca: "Dinner Lady",
            price: 8,
            status: true,
            _id: 345675234
        });
        try {
            const result = await product.save()
            console.log(result) // Imprime el resultado para depurar
            expect(result).to.be.an("object").and.to.have.property("_id")
            .and.to.be.ok.and.have.property("title").and.to.be.equal("Dinner Lady")
        } catch (error) {
            console.error(error);
            // Aquí puedes añadir más lógica para manejar el error
        }
    })
    it("Obtenemos el producto creado", async () => {
        const products = new Products()
        const result = await products.getBy({ category: "liquidos"})
        expect(result).to.be.an("object").and.to.have.property("_id")
    })
    
})