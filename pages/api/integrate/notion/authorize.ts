import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { code, state } = req.body;

        const supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        );

        try {
            const chatbot_id = Buffer.from(state, "base64").toString("utf-8");

            const basicToken = Buffer.from(`${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString("base64");

            const payload = {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/notion/integrate`
            }

            console.log({ payload })

            const response = await axios.post(`https://api.notion.com/v1/oauth/token`, payload, {
                headers: {
                    Authorization: `Basic ${basicToken}`,
                    "Content-Type": "application/json"
                }
            });

            console.log(response.data)

            const accessToken = response.data.access_token;
            const botId = response.data.bot_id;
            const duplicatedTemplateId = response.data.duplicated_template_id;
            const owner = response.data.owner;
            const workspaceIcon = response.data.workspace_icon;
            const workspaceId = response.data.workspace_id;
            const workspaceName = response.data.workspace_name;

            const metadata = {
                botId,
                duplicatedTemplateId,
                owner,
                workspaceIcon,
                workspaceId,
                workspaceName
            };

            const { data, error } = await supabaseClient.from("chatbot").select("*").eq("id", chatbot_id).single()

            if (!data || error) {
                throw new Error("Problem retrieiving chatbot in state");
            }

            const { data: existingIntegration, error: existingIntegrationError } = await supabaseClient.from("integration").select("*").eq("chatbot_id", chatbot_id).single()

            if (existingIntegration) {
                return res.status(200).json({
                    is_success: true,
                });
            }

            const { data: integration, error: integrationError } = await supabaseClient.from("integration").select("*").eq("chatbot_id", chatbot_id).single()

            let savedIntegration: any;

            if (integration) {
                savedIntegration = await supabaseClient.from("integration").update({
                    app_name: "notion",
                    access_token: accessToken,
                    metadata: metadata,
                    user_id: data.user_id,
                    updated_at: new Date().toISOString()
                }).eq("id", integration.id).select()
            } else {
                savedIntegration = await supabaseClient.from("integration").insert({
                    app_name: "notion",
                    access_token: accessToken,
                    metadata: metadata,
                    user_id: data.user_id,
                    chatbot_id
                }).select()
            }

            return res.status(200).json({
                is_success: true,
            });
        } catch (error) {
            // @ts-ignore
            console.log({ error: error.response.data })

            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message,
                });
            }

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

export default handler;
