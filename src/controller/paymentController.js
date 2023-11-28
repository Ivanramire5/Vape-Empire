
import axios from "axios"
import {
    HOST, 
    PAYPAL_API, 
    PAYPAL_API_CLIENT, 
    PAYPAL_API_SECRET 
} from "../config/payment.config.js"

export const createOrder = async (req, res) => {
    try {
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: "1000.00",
                    },
                },
            ],
            application_context: {
                brand_name: "VapeEmpire",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `${HOST}/capture-order`,
                cancel_url: `${HOST}/cancel-payment`,
            }
        };

        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");

        const {
            data: { access_token },
        } = await axios.post(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/-www-form-urlencoded",
                },
                auth: {
                    username: PAYPAL_API_CLIENT,
                    password: PAYPAL_API_SECRET,
                },
            }
        );

        console.log(access_token);
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        )
        console.log(response.data)

        return res.json(response.data);
    } catch (error) {
        console.log(error)
        return res.status(500).json("Algo salio mal")
    }
}

export const captureOrder = async (req, res) => {
    const { token } = req.query;
    try {
        const response = await axios.post(
            `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
            {},
            {
                auth: {
                    username: PAYPAL_API_CLIENT,
                    password: PAYPAL_API_SECRET,
                },
            }
        );

        console.log(response.data);

        res.redirect("/payed.html")
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const cancelPayment = (req, res) => res.redirect("/realtimeproducts")