import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET" && req.method !== "PATCH") {
        return res.status(405).send("Method not allowed");
    }

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    });

    try {
        const { data: user } = await supabaseServerClient.auth.getUser();

        if (!user) {
            res.redirect("/login");
        }

        const { data: chatbot, error: chatbotError } = await supabaseServerClient.from("chatbot").select("id").eq("user_id", user.user?.id).single();

        if (chatbotError) {
            throw new Error(chatbotError.message);
        }

        const { data: billing, error: billingError } = await supabaseServerClient.from("billing").select("*").eq("chatbot_id", chatbot.id).single();

        if (billingError) {
            throw new Error(billingError.message);
        }

        return res.status(200).json({
            billing,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(400).json(error);
        }

        return res.status(500).send("Internal server error");
    }
}

export default handler;