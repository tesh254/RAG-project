import { createClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import Cors from "nextjs-cors";

const supabaseServerClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

const addNewChat = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["POST"],
        origin: "*",
        optionsSuccessStatus: 200
    });

    try {
        const { chatbot_id, user_fp } = req.body;

        console.log({ chatbot_id, user_fp })

        const { data: usage, error } = await supabaseServerClient
            .from("chat_usage")
            .select("*")
            .eq("chatbot_id", chatbot_id)
            .single()

        const { data: billing } = await supabaseServerClient
            .from("billing")
            .select("*")
            .eq("chatbot_id", chatbot_id)
            .single()

        console.log({ usage });

        if (usage) {
            if (!usage.user_fp.includes(user_fp)) {
                await supabaseServerClient
                    .from("chat_usage")
                    .update({
                        "user_fp": [...usage.user_fp, user_fp],
                        chats: usage.chats + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq("chatbot_id", chatbot_id)
            }

            return res.status(200).send("ok");
        }

        await supabaseServerClient.from("chat_usage")
            .insert({
                chatbot_id,
                chats: 1,
                user_fp: [user_fp],
                billing_id: billing?.id,
            })

        return res.status(200).send("ok");

    } catch (error) {

    }
}

const handler = nc({ attachParams: true }).post(addNewChat);

export default handler;