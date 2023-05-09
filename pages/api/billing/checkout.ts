import nc from "next-connect";
import stripe from "../../../lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { protocol } from "../../../lib/sanitizer";

const initCheckout = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { price_id, customer_id, user } = req.body;

        console.log({ customer_id })

        let customer: any = {};

        if (!customer_id) {
            const existingCustomer = await stripe.private.customers.list({
                email: user.email,
                limit: 1,
            });

            if (existingCustomer.data.length > 0) {
                customer = existingCustomer.data[0];
            } else {
                customer = await stripe.private.customers.create({
                    email: user.email,
                });
            }
        } else {
            Object.assign(customer, {
                id: customer_id
            });
        }

        const session = await stripe.private.checkout.sessions.create({
            line_items: [
                {
                    price: price_id,
                    quantity: 1,
                }
            ],
            customer: customer?.id ?? customer_id,
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`
        });

        const checkoutUrl = session.url as unknown as string;

        res.status(200).json({
            url: checkoutUrl,
        });
    } catch (error: unknown) {
        // @ts-ignore
        console.log(error.message);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

const handler = nc({ attachParams: true }).post(initCheckout);

export default handler;
