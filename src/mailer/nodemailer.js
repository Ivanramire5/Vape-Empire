
import nodemailer from "nodemailer"
import { configuration } from "../config/payment.config.js"

configuration()

export const transport = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.MAILING_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN
    }
})
transport.verify().then(() => {
    console.log("Ready for send emails")
})