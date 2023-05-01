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
        const { user } = req.body;

        try {
            const products = await stripe.private.products.list({
                active: true,
                expand: ['data.price'],
            });

            const existingCustomer = await stripe.private.customers.list({
                email: user.email,
                limit: 1,
            });

            let customer;

            if (existingCustomer.data.length > 0) {
                customer = existingCustomer.data[0];
            } else {
                customer = await stripe.private.customers.create({
                    email: user.email,
                });
            }

            for (let i = 0; i < products.data.length; i++) {
                const res = await stripe.private.prices.list({
                    product: products.data[i].id,
                });

                Object.assign(products.data[i], {
                    price: res.data[0],
                });
            }

            if (user) {
                const { data: chatbot, error: chatbotError } = await supabaseServerClient.from("chatbot").select("id").eq("user_id", user?.id).single();

                if (chatbot) {
                    const { data: existingBilling, error: existingBillingError } = await supabaseServerClient.from("billing").select("*").eq("chatbot_id", chatbot.id);

                    if (existingBilling && existingBilling?.length > 0) {
                        return res.status(200).json({
                            billing: existingBilling[0],
                            plans: products.data,
                        });
                    }

                    const { data: billing, error: billingError } = await supabaseServerClient.from("billing").insert({
                        chatbot_id: chatbot.id,
                        openai_api_k: "",
                        price_id: process.env.STRIPE_PRICING_DEFAULT_API_ID,
                        product_id: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_DEFAULT_ID,
                        user_id: user.id,
                        billing_id: customer.id,
                        subscription_id: "",
                    }).select();

                    if (billingError) {
                        throw new Error(billingError.message);
                    }

                    return res.status(201).json({
                        billing: billing[0],
                        plans: products.data,
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