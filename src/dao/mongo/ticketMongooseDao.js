import ticketScheema from "./models/ticketSchema.js"

export class ticketMongooseDao {
    async getTickets() {
        return await ticketScheema.find({})
    }

    async getTicketById(tid) {
        return ticketScheema.findById(tid)
    }

    async saveTicket(ticket) {
        return await ticketScheema.create(ticket)
    }
}