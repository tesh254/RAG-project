import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import stripe from "../../../lib/stripe";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST" && req.method !== "PATCH") {
        return res.status(405).send("Method not allowed");
    }

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });

    const products = await stripe.private.products.list({
        active: true,
        expand: ['data.price'],
    });

    
    for (let i = 0; i < products.data.length; i++) {
        const res = await stripe.private.prices.list({
            product: products.data[i].id,
        });
        
        Object.assign(products.data[i], {
            price: res.data[0],
        });
    }
    
    console.error({ products: products.data });

    let customer: any;

    const existingCustomer = await stripe.private.customers.list({
        email: req.body.user.email,
        limit: 1,
    });

    if (existingCustomer.data.length > 0) {
        customer = existingCustomer.data[0];
    } else {
        customer = await stripe.private.customers.create({
            email: req.body.user.email,
        });
    }

    try {
        const { data: chatbot, error: chatbotError } = await supabaseServerClient.from("chatbot").select("id").eq("user_id", req.body.user.id).single();

        if (chatbotError) {
            throw new Error(chatbotError.message);
        }

        const { data: billing, error: billingError } = await supabaseServerClient.from("billing").select("*").eq("chatbot_id", chatbot.id).single();

        let newBilling: any;

        if (billingError || !billing) {
            newBilling = await supabaseServerClient.from("billing").insert({ user_id: req.body.user.id, chatbot_id: chatbot.id, billing_id: customer.id  }).select();
        }

        return res.status(200).json({
            billing: billing ?? newBilling,
            plans: products.data,
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json(error);
        }

        return res.status(500).send("Internal server error");
    }
}

export default handler;