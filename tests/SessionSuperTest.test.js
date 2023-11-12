
import mongoose from "mongoose"
import chai from "chai"
import supertest from "supertest"
import Session from "../src/dao/mongo/sessionMongooseDao.js"
import sessionSchema from "../src/dao/mongo/models/sesionSchema.js"
import { response } from "express"


//Vamos a utlizar supertest y chai (testing avanzado) para hacer este test

mongoose.connect(
    `mongodb+srv://ivanr4amire5:y9tN2DQWF1a5tQmH@database1.hng81to.mongodb.net/e-commerce`
);

const expect = chai.expect
const requester = supertest("http://localhost:8080");

const sessionData = async (id) => {
    try {
        const { statusCode, ok, _body } = await requester
            .get("/" + id)
            .send()
        if (_body && _body.payload) {
            return _body.payload;
        } else {
            console.error('No se pudo obtener el payload de la sesión');
            return null;
        }
    } catch (error) {
        console.error('Ocurrió un error al obtener los datos de la sesión:', error);
        return null;
    }
};


//Comenzamos a trabajar los datos del usuario para crear session
describe("Testing de session", () => {
    describe("Test de usuarios para hacer una prueba", () => {
        it("Obtenemos un usuario de la base de datos haciendo una prueba", async () => {
            const users = await sessionSchema.find()
            console.log(users)
            expect(users).to.be.an("array");
        })
        it("El endpoint POST / debe crear un usuario con exito", async () => {
            const userMock = new Session ({
                first_name: "Gabe",
                last_name: "Newell",
                email: "gabenew@gmail.com",
                password: "steam123",
            });
            
            const { statusCode, ok, _body } = await requester
            .post("/")
            .send(userMock)
             //console.log({ statusCode }, { ok }, { _body });
            if (typeof _body === 'object' && _body !== null) {
                expect(_body?.payload).to.be.an("array");
                expect(_body?.payload).to.have.property("first_name");
            }
        })
        
        it("Creamos un usuario sin nombre ni apellido, el resultado deberia ser un error 404", async () => {
            const userMock = {
                email: "juancarlos@gmail.com",
                password: "bodoque15",
            };
            const {statusCode} = await requester.post("/").send(userMock);
        
            expect(statusCode).to.be.equal(404)
        })

        it("Obtenemos todos los usuarios de nuestra base de datos", async () => {
            const response = await requester.get("/");
            console.log(response.body) 
            if(response.body) { 
                const payload = response.body.payload; 
                const isAnArray = Array.isArray(response.body.users); 
                expect(response.statusCode).to.be.equal(200);
                expect(response.ok).to.be.true;
                if(payload) { 
                    expect(payload).to.be.an("array"); 
                    expect(isAnArray).to.be.true;
                }
            } else {
                throw new Error(`Error: payload no está definido. Status: ${response.statusCode}. Body: ${response.body}`)
            }
        });
        
        it("Actualizamos la sesion del usuario", async () => {
            const userSession = "ekvxlsakierdks";
            const previousSession = await sessionData(userSession)
        
            if (previousSession && previousSession.first_name) {
                const userMock = new Session ({
                    first_name: "Diego",
                    last_name: "Maradona",
                    email: "diegomaradona98@gmail.com",
                    password: "diego123",
                });
                const { ok, statusCode, _body } = await requester
                .put("/" + userSession)
                .send(userMock)
                const newSessionData = await sessionData(userSession)
                if (newSessionData && newSessionData.first_name) {
                    console.log(previousSession.first_name, newSessionData.first_name)
                    expect(previousSession.first_name).to.be.not.equal(newSessionData.first_name)
                } else {
                    console.error('No se pudo obtener el primer nombre de la nueva sesión');
                }
            } else {
                console.error('No se pudo obtener el primer nombre de la sesión anterior');
            }
        });
        it("Eliminamos el usuario creado", async function() {
            // Arrange
            this.timeout(5000);
            const userSession = "ekvxlsakierdks";
            const userMock = new Session ({
                first_name: "Diego",
                last_name: "Maradona",
                email: "diegomaradona98@gmail.com",
                password: "diego123",
            });
            try {
                
                const { statusCode, ok, _body } = await requester
                    .delete("/" + userSession.first_name)
                    .send(userMock)
                
                if (_body && _body.message) {
                    console.log("First data user", userSession);
                    console.log("Usuario actualizado", userMock);
                    expect(_body.message).to.be.equal("Usuario eliminado con exito")
                } else {
                    console.error('No se pudo obtener el mensaje de la respuesta');
                }
            } catch (error) {
                console.error('Ocurrió un error al eliminar el usuario:', error);
            }
        });
    })
})