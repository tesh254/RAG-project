import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Client, collectPaginatedAPI } from "@notionhq/client";
import { IPageProps } from "../../../../../../components/notion-connect/page-item";
import { cleanAndExtractText, genChecksum, renderBlock, splitString, trimStr } from "../../../../../../lib/sanitizer";
import { Configuration, OpenAIApi } from "openai";

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type Pages = IPageProps[];

type RequestBody = {
    chatbot_id: number;
    pages: Pages;
};

export interface Block {
    object: string;
    id: string;
    parent: {
        type: string;
        page_id: "page_id" | "block_id";
    };
    created_time: string;
    last_edited_time: string;
    created_by: {
        object: string;
        id: string;
    };
    last_edited_by: {
        object: string;
        id: string;
    };
    has_children: boolean;
    archived: boolean;
    type: string;
    child_database: {
        title: string;
    };
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const { chatbot_id, pages } = req.body as RequestBody;

            const { data: billing, error: billingError } = await supabaseClient
                .from("billing")
                .select("openai_api_k")
                .eq("chatbot_id", chatbot_id)
                .single()

            if (billingError || !billing) {
                throw new Error("You are not subscribed to any billing plan")
            }

            const { data: integration, error: integrationError } = await supabaseClient
                .from("integration")
                .select("access_token")
                .eq("chatbot_id", chatbot_id)
                .single();

            if (integrationError || !integration) {
                throw new Error("Notion is not connected to Suportal");
            }

            const notion = new Client({
                auth: integration.access_token,
            });

            const blockContent: { doc_id: string; data: Block }[] = [];

            for (let i = 0; i < pages.length; i++) {
                const block = pages[i];

                const response = await axios.get(`https://api.notion.com/v1/blocks/${block.id}`, {
                    headers: {
                        "Notion-Version": "2022-06-28",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${integration.access_token}`,
                    },
                });

                blockContent.push({
                    doc_id: block.id,
                    data: response.data as Block,
                });

                setTimeout(() => { }, 500);
            }

            const blockChildren: { [key: string]: Block[] } = {};

            for (let i = 0; i < blockContent.length; i++) {
                const block = blockContent[i];

                const response = await collectPaginatedAPI(notion.blocks.children.list, {
                    block_id: block.data.id,
                });

                for (let j = 0; j < response.length; j++) {
                    const child = response[j] as Block;

                    if (child.parent.type === "page_id") {
                        if (!blockChildren[child.parent.page_id]) {
                            Object.assign(blockChildren, {
                                [child.parent.page_id]: [child],
                            });
                        } else {
                            const prevContent = blockChildren[child.parent.page_id];

                            Object.assign(blockChildren, {
                                [child.parent.page_id]: [...prevContent, child],
                            });
                        }
                    }
                }

                setTimeout(() => { }, 500);
            }

            const errors = []

            Object.entries(blockChildren).forEach(async ([pageId, block]) => {
                let content = "";
                for (let i = 0; i < block.length; i++) {
                    content += `${cleanAndExtractText(renderBlock(block[i]))}\n`;
                }

                let apiKey = process.env.OPEN_API_KEY;

                if (billing.openai_api_k) {
                    apiKey = billing.openai_api_k;
                }

                const configuration = new Configuration({
                    apiKey,
                })

                const openai = new OpenAIApi(configuration);

                const trimmedString = trimStr(content);

                const trimmedStrings = splitString(trimmedString, 4095)

                trimmedStrings.forEach(async (input) => {
                    const shaChecksum = genChecksum(input);

                    const { data: docContent, error: contentError } = await supabaseClient.from("document").select("*").eq("sha_checksum", shaChecksum).eq("doc_id", pageId).single()

                    if (!docContent || contentError) {
                        const embeddingResponse = await openai.createEmbedding({
                            model: "text-embedding-ada-001",
                            input: input,
                        })

                        if (embeddingResponse.status !== 200) {
                            const [responseData] = embeddingResponse.data.data;

                            await supabaseClient.from("document")
                                .insert({
                                    name: `chatbot_id-${chatbot_id};page_id-${pageId}`,
                                    metadata: {},
                                    type: "notion-doc",
                                    is_trained: true,
                                    chatbot_id,
                                    embeddings: responseData.embedding,
                                    doc_id: pageId,
                                    sha_checksum: shaChecksum,
                                    last_trained: new Date().toISOString(),
                                })
                        }
                    }
                })
            })

            return res.status(200).json({
                block_content: blockChildren,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    message: error.message,
                });
            }

            return res.status(500).send("Internal server error");
        }
    }
};

export default handler;
