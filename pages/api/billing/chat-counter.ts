import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { static_plans } from "../../../data/plans";
import { PlansType } from "../../billing";

const getChatsCreated = async (req: NextApiRequest, res: NextApiResponse) => {
    const { billing_id, plans } = req.body as {
        billing_id: number;
        plans: PlansType[],
    };

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });

    const { data: billing, error: billingError } = await supabaseServerClient.from("billing")
        .select("*")
        .eq("id", billing_id)
        .single();

    if (!billing || billingError) {
        throw new Error("Problem gettings chat counts");
    }

    const injectedChats = [];

    for (let i = 0; i < plans.length; i++) {
        const curr = plans[i];

        for (let j = 0; j < static_plans.length; j++) {
            if (curr.name === static_plans[j].label) {
                injectedChats.push({
                    ...static_plans[j],
                    ...curr,
                    key: curr.default_price,
                })
            }
        }
    }

    const limit = injectedChats.find(item => item.key === billing.price_id)?.chats ?? 0;

    const { data: usage, error: usageError } = await supabaseServerClient.from("chat_usage")
        .select("*")
        .eq("billing_id", billing_id)
        .single();

    const suggestedPricing = injectedChats.filter(item => item.chats > limit).map(item => item.label);

    const chatCount = usage ? usage.chats : 0;

    return res.status(200).json({
        limit,
        count: chatCount,
        suggested: suggestedPricing.join(" or "),
    });
}

const handler: NextApiHandler = nc({ attachParams: true }).post(getChatsCreated);

export default handler;

