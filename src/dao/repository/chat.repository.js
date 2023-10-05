
//Este codigo obtiene y crea mensajes.
//Usa ChatDto para estructurar los mensajes antes de crearlos

import { ChatDto } from "../DTO/chat.dto.js";

export class ChatRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getMessages() {
        return await this.dao.getMessages()
    }

    async createMessage(message) {
        const messageDto = new ChatDto(message)
        return await this.dao.createMessage(messageDto)
    }
}


