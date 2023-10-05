
import { MESSAGES_MODEL } from "./models/messages.model.js";

export class ChatMongoDao {
    
    async getMessages() {
        return await MESSAGES_MODEL.find({}).lean({})
    }

    async createMessage(message) {
        return await MESSAGES_MODEL.create(message)
    }
}