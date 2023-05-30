import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import Cors from "nextjs-cors";
import axios from "axios";
import nextConnect from "next-connect"
import { createClient } from "@supabase/supabase-js"

const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200,
    });

    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE as string
    );

    try {
        const headers = req.headers;

        if (!headers["x-api-key"]) {
            throw new Error("Unauthorized");
        }

        if (headers["x-api-key"] && headers["x-api-key"] !== process.env.ADMIN_TOKEN) {
            throw new Error("Unauthorized");
        }

        const { data: user, error } = await supabaseClient.auth.admin.getUserById(req.query.id as unknown as string);

        const userWithChabot = {

        };

        if (user && user.user) {
            const { data: chatbot, error: chatbotError } = await supabaseClient.from("chatbot").select("*").eq("user_id", user.user.id)

            if (chatbot && chatbot.length > 0) {
                Object.assign(userWithChabot, {
                    ...user.user,
                    chatbot: chatbot[0]
                });
            }
        }
        
        return res.status(200).json({
            user: userWithChabot,
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            // @ts-ignore
            message: `error: ${error.message}`
        })
    }
}

const handler: NextApiHandler = nextConnect({ attachParams: true }).get(getUserById);

export default handler;