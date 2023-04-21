import { createClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200,
    });

    if (req.method === "POST") {
        try {
            const body = req.body;
            const chatbotId = req.query.chatbot_id;

            const supabaseClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL as string,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
            );
            body.links.forEach(async (item: string) => {
                const { data: result, error } = await supabaseClient.from("websitelink").select("*").eq('path', item).eq("chatbot_id", chatbotId)

                if (result?.length !== 0) {
                    return;
                } else {
                    await supabaseClient
                        .from("websitelink")
                        .insert({
                            chatbot_id: chatbotId,
                            is_trained: false,
                            path: item,
                        })
                }
            })

            return res.status(200).json({
                message: "Successfully created a new websitelink",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Problem get website links"
            })
        }
    }
}

export default handler;