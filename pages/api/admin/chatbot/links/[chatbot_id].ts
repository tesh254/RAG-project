import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import Cors from "nextjs-cors";
import axios from "axios";
import nextConnect from "next-connect";
import { createClient } from "@supabase/supabase-js";

const getChatbotLinks = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200,
    });

    const chatbot_id = req.query.chatbot_id as unknown as number;

    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );

    const { data: chatbot, error: chatbotError } = await supabaseClient.from("chatbot")
        .select("*")
        .eq("id", chatbot_id)
        .single();

    try {
        const headers = req.headers;

        if (!headers["x-api-key"]) {
            throw new Error("Unauthorized");
        }

        if (headers["x-api-key"] && headers["x-api-key"] !== process.env.ADMIN_TOKEN) {
            throw new Error("Unauthorized");
        }

        const { data: links, error } = await supabaseClient
            .from("websitelink")
            .select("*")
            .eq("chatbot_id", chatbot_id);

        let paths: any = links;

        // @ts-ignore
        for (let i = 0; i < paths?.length; i++) {
            const { data: content, error } = await supabaseClient
                .from("websitecontent")
                .select("*")
                .eq("websitelink_id", paths[i].id)

            const currentItem = paths[i];

            const apiURL = process.env.NEXT_PUBLIC_BASE_URL;

            if (content?.length === 0) {
                if (chatbot) {
                    await axios.post(`${apiURL}/api/admin/retrain`, {
                        base_link: chatbot.website_link,
                        chatbot_id: chatbot.id,
                        paths: [paths[i]]
                    }, {
                        headers: {
                            "x-api-key": headers["x-api-key"],
                        }
                    });
                }
            }

            const newPaths = [...paths.filter((item: any) => item.id !== paths[i].id), { ...currentItem, content }]

            paths = newPaths;

            if (content) {
                paths[i].content = content;
            }
        }

        if (error) {
            throw error;
        }

        return res.status(200).json({
            paths: paths,
        });
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: `error:\n${error}`
        })
    }
}

const handler = nextConnect({ attachParams: true }).post(getChatbotLinks);

export default handler;