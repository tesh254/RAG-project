import nc from "next-connect";
import stripe from "../../../lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";

const initCheckout = async (req: NextApiRequest, res: NextApiResponse) => {
    const { price_id, billing_id, customer_id } = req.body;

    const session = await stripe.private.checkout.sessions.create({
        line_items: [
            {
                price: price_id,
                quantity: 1,
            }
        ],
        customer: customer_id,
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`
    });

    const checkoutUrl = session.url as unknown as string;

    res.status(200).json({
        url: checkoutUrl,
    });
}

const handler = nc({ attachParams: true }).post(initCheckout);

export default handler;
