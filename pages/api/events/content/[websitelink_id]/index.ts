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
            const websitelinkId = req.query.websitelink_id;

            const supabaseClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL as string,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
            );

            await supabaseClient
                .from("websitecontent")
                .insert({
                    websitelink_id: websitelinkId,
                    content: body.content,
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