import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        );

        try {
            const { chatbot_id } = req.body;

            const { data: integration, error: integrationError } = await supabaseClient.from("integration").select("access_token").eq("chatbot_id", chatbot_id).single()

            if (integrationError || !integration) {
                throw new Error("Notion is not connected to Suportal");
            }

            const response = await axios.post(`https://api.notion.com/v1/search`, {
                "query": "",
                "filter": {
                    "value": "database",
                    "property": "object"
                },
                "sort": {
                    "direction": "ascending",
                    "timestamp": "last_edited_time"
                }
            }, {
                headers: {
                    Authorization: `Bearer ${integration.access_token}`,
                    'Notion-Version': '2022-06-28',
                    "Content-Type": "application/json"
                }
            })

            return res.status(200).json(response.data)
        } catch (error) {
            console.log(error)

            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message,
                })
            }

            return res.status(500).send("Internal server error")
        }
    }
}

export default handler;