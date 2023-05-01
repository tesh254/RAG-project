import { createClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { addDays } from "date-fns";
import stripe from "../../../lib/stripe";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
        );

        const { data: billing } = await supabaseClient.from("billing").select("*");

        if (!billing) {
            return res.status(500).json("Internal server error handling cron");
        }

        for (let i = 0; i < billing.length; i++) {
            // @ts-ignore
            const { data: usage, } = await supabaseClient.from("chat_usage").select("id").eq("billing_id", billing.id).single();

            if (usage) {
                // @ts-ignore
                if (new Date().getTime > new Date(addDays(billing.next_billing, 3)).getTime()) {
                    // @ts-ignore
                    await supabaseClient.from("chat_usage").delete("billing_id", billing.id);
                }
            }

            const products = await stripe.private.products.list({});

            const product = products.data.find(item => item.name === "Free");

            if (product) {
                await supabaseClient.from("billing").update({
                    is_paid: false,
                    price_id: product.default_price,
                    product_id: product.id,
                    subscription_id: null,
                    next_billing: addDays(new Date(), 30).toISOString(),
                }).eq("id", billing[i].id)
            }

        }
    } catch (error: unknown) {

    }
}

export default handler;