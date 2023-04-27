import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import stripe from "../../../lib/stripe";

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { email } = req.body;

        const customer = await stripe.private.customers.create({
            email,
        });

        return res.status(201).json({
            customer,
            code: 'customer_created'
        })
    } catch (error: unknown) {
        return res.status(400).json({
            code: 'customer_creation_failed',
            error,
        });
    }
}

const handler: NextApiHandler = nc({ attachParams: true }).post(createCustomer);

export default handler;