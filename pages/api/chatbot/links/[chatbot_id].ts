import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseServerClient = createServerSupabaseClient({
        req, res,
    });

    const { error: userError } = await supabaseServerClient.auth.getUser();

    if (userError) {
        return res.status(403).json(userError);
    }

    if (req.method === "GET") {
        try {
            const { data, error } = await supabaseServerClient
                .from("websitelink")
                .select("*")
                .eq("chatbot_id", req.query.chatbot_id);

            if (error) {
                throw error;
            }

            return res.status(200).json({
                paths: data,
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default handler;