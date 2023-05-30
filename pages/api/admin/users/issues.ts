import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import Cors from "nextjs-cors";
import axios from "axios";
import nextConnect from "next-connect"
import { createClient } from "@supabase/supabase-js"

const getUsersWithIssues = async (req: NextApiRequest, res: NextApiResponse) => {
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

        const { data: users, error } = await supabaseClient.auth.admin.listUsers();
        if (error) {
            throw error;
        }

        // to store all users with chatbots without links
        let fetchedUsers = [];

        // get user chatbots
        for (let i = 0; i < users.users.length; i++) {
            const { data: chatbot, error: chabotError } = await supabaseClient.from("chatbot").select("*").eq("user_id", users.users[i].id);

            console.log(chatbot, chabotError)

            if (chatbot && chatbot?.length > 0) {
                if (chatbot) {
                    // get all websitelinks for that chatbot
                    const { data: website, error: websiteError } = await supabaseClient.from("websitelink").select("*").eq("chatbot_id", chatbot[0].id)

                    if (website && website.length === 0) {
                        fetchedUsers.push({
                            user: {
                                email: users.users[i].email,
                                base_url: chatbot[0].website_link,
                                id: users.users[i].id,
                                chatbot_id: chatbot[0].id
                            }
                        })
                    } 
                }
            }
        }

        return res.status(200).json({
            users: fetchedUsers,
        })
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            // @ts-ignore
            message: `error: ${error.message}`
        })
    }
}

const handler: NextApiHandler = nextConnect({ attachParams: true }).post(getUsersWithIssues);

export default handler;