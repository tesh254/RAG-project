import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import stripe from "../../../lib/stripe";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST" && req.method !== "PATCH") {
        return res.status(405).send("Method not allowed");
    }

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });


    if (req.method === "POST") {
        try {
            const { data: user, error } = await supabaseServerClient.auth.getUser();

            if (user) {
                const { data: chatbot, error: chatbotError } = await supabaseServerClient.from("chatbot").select("id").eq("user_id", user?.user?.id).single();

                if (chatbot) {
                    const { data: existingBilling, error: existingBillingError } = await supabaseServerClient.from("billing").select("*").eq("chatbot_id", chatbot.id).single();

                    if (existingBilling) {
                        return res.status(200).json({
                            billing: existingBilling,
                        });
                    }

                    const customer = await stripe.private.customers.create({
                        email: user.user?.email,
                    });

                    const { data: billing, error: billingError } = await supabaseServerClient.from("billing").insert({
                        chatbot_id: chatbot.id,
                        openai_api_k: "",
                        product_id: process.env.STRIPE_PRICING_DEFAULT_API_ID,
                        user_id: user.user?.id,
                        billing_id: customer.id
                    }).single();

                    if (billingError) {
                        throw new Error(billingError.message);
                    }

                    return res.status(201).json({
                        billing,
                    });
                } else {
                    throw new Error("Chatbot does not exist");
                }
            }

            res.redirect("/login");
        } catch (error: unknown) {
            console.log({ error });
            if (error instanceof Error) {
                return res.status(400).json(error);
            }

            return res.status(500).json(new Error("Internal server error"));
        }
    }

    if (req.method === "PATCH") {

    }
}

export default handler;