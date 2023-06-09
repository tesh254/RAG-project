import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect"

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

const isConnected = async (req: NextApiRequest, res: NextApiResponse) => {
    const { chatbot_id } = req.query;

    try {
        const integration = await supabaseClient.from("integration").select("id").eq("chatbot_id", chatbot_id).single();

        console.log(integration)

        if (!integration.data || integration.error) {
            return res.status(200).json({
                is_connected: false,
            });
        }

        return res.status(200).json({
            is_connected: true,
        });
    } catch (error) {
        return res.status(200).json({
            is_connected: false,
        });
    }
}

export const handler = nc({ attachParams: true }).get(isConnected);

export default handler;