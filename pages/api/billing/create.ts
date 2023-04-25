import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type RequestBody = {
    chatbot_id: number;
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });

    const body = req.body as RequestBody;

    try {
        const { data: user, error } = await supabaseServerClient.auth.getUser();

        if (user) {
            const { data: chatbot, error: chatbotError } = await supabaseServerClient.from("chatbot").select("*").eq("id", body.chatbot_id).single();

            if (chatbot) {
                const { data: existingBilling, error: existingBillingError } = await supabaseServerClient.from("billing").select("*").eq("chatbot_id", body.chatbot_id).single();
                if (existingBilling) {
                    return res.status(200).json({
                        billing: existingBilling,
                    });
                }

                const { data: billing, error: billingError } = await supabaseServerClient.from("billing").insert({
                    chatbot_id: body.chatbot_id,
                    plan_slug: "free",
                    plan_label: "Free",
                    openai_api_k: "",
                });

                return res.status(201).json({
                    billing,
                });
            } else {
                throw new Error("Chatbot does not exist");
            }
        }

        res.redirect("/login");
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json(error);
        }

        return res.status(500).json(new Error("Internal server error"));
    }
}

export default handler;