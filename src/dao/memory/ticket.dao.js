
import { TICKET_MODEL } from "../mongo/models/ticket.model.js"

export class TicketMemoryDao{
    async getTickets(){
        return await TICKET_MODEL.find({})
    }

   async getTicketById(tid){
        return TICKET_MODEL.findById(tid)
    }

   async saveTicket(ticket){
       return await TICKET_MODEL.create(ticket)
   }
}