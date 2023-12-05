
import chatSchema from "./models/chatSchema.js";

export class ChatMongooseDao {

    async getMessages(){
        return await chatSchema.find({}).lean({})
    }

    async createMessage(message){
        return await chatSchema.create(message)
    }
}