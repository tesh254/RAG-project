import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import stripe from "../../../lib/stripe";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).send("Method not allowed");

    if (req.method === "GET") {        
        try {
            const plans = await stripe.private.plans.list({
                expand: ["data.product"]
            });

            return res.status(200).json({
                plans: plans.data,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json(error);
            }

            return res.status(500).send("Internal server error");
        }
    }
};

export default handler;