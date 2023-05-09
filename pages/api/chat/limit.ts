import { createClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import Cors from "nextjs-cors";
import stripe from "../../../lib/stripe";
import { static_plans } from "../../../data/plans";

const supabaseServerClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

const isLimitExceeded = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["POST"],
        origin: "*",
        optionsSuccessStatus: 200
    });

    try {
        const { chatbot_id } = req.body;

        const plans = await stripe.private.products.list({
            active: true,
            expand: ['data.price'],
        });

        for (let i = 0; i < plans.data.length; i++) {
            const res = await stripe.private.prices.list({
                product: plans.data[i].id,
            });

            Object.assign(plans.data[i], {
                price: res.data[0],
            });
        }

        const injectedPlans = [];

        for (let i = 0; i < plans.data.length; i++) {
            const curr = plans.data[i];

            for (let j = 0; j < static_plans.length; j++) {
                if (curr.name === static_plans[j].label) {
                    injectedPlans.push({
                        ...static_plans[j],
                        ...curr,
                        key: curr.default_price,
                    })
                }
            }
        }


        const { data: usage, error } = await supabaseServerClient
            .from("chat_usage")
            .select("*")
            .eq("chatbot_id", chatbot_id)
            .single()

        const { data: billing } = await supabaseServerClient
            .from("billing")
            .select("*")
            .eq("chatbot_id", chatbot_id)
            .single()

        const limit = injectedPlans.find(item => item.key === billing?.price_id)?.chats ?? 0;

        const chatCount = usage ? usage.chats : 0;

        let isUserUsingOldPlan = !injectedPlans.map(item => item.id).includes(billing?.product_id);

        if (limit <= chatCount || isUserUsingOldPlan || !billing) {
            return res.status(200).json({
                is_limit_exceeded: true,
            })
        }

        return res.status(200).json({
            is_limit_exceeded: false,
        });
    } catch (error) {
        return res.status(200).json({
            is_limit_exceeded: true,
        });
    }
}

const handler: NextApiHandler = nc({ attachParams: true }).post(isLimitExceeded);

export default handler;