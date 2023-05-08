import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import nc from "next-connect";
import stripe from "../../../lib/stripe";

const saveApiKey = async (req: NextApiRequest, res: NextApiResponse) => {
    const subapaseServerClient = createServerSupabaseClient({
        req,
        res,
    });

    const { data: { session } } = await subapaseServerClient.auth.getSession()

    const { billing_id, api_key } = req.body;

    try {
        let billing = await subapaseServerClient
            .from("billing")
            .select("*")
            .eq("id", billing_id)
            .single();

        if (!billing.data || billing.error) {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/billing/create`, {
                user: session?.user
            }, {
                withCredentials: true,
            });

            billing = response.data.billing;
        }

        if (billing && billing.data && billing.data.product_id) {
            const { data: { product_id, id } } = billing;

            const product = await stripe.private.products.retrieve(product_id);

            if (product.name === "Developer") {
                const updatedBilling = await subapaseServerClient.from("billing")
                    .update({
                        openai_api_k: api_key,
                    })
                    .eq("id", id)
                    .select("*");

                return res.status(200).json({
                    billing: updatedBilling,
                });
            } else {
                throw new Error("Please subscribe to the developer plan to add a custom API Key");
            }
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json({
                message: error.message,
            });
        }

        return res.status(500).send("Internal server error");
    }

}

const handler: NextApiHandler = nc({ attachParams: true }).post(saveApiKey);

export default handler;