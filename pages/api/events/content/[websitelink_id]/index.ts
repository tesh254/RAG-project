import { createClient } from "@supabase/supabase-js";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import Cors from "nextjs-cors";
import { genChecksum, trimStr } from "../../../../../lib/sanitizer";

const openAiKey = process.env.OPEN_API_KEY;

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

            const configuration = new Configuration({
                apiKey: openAiKey
            });

            const openai = new OpenAIApi(configuration);

            const trimmedString = trimStr(body.content);

            const shaChecksum = genChecksum(trimmedString);

            const { data: content, error: contentError } = await supabaseClient
                .from("websitecontent")
                .select("*")
                .eq("sha_checksum", shaChecksum)
                .eq("websitelink_id", websitelinkId)
                .limit(1)
                .single()

            if (!content) {
                const embeddingResponse = await openai.createEmbedding({
                    model: 'text-embedding-ada-002',
                    input: trimmedString,
                });

                if (embeddingResponse.status !== 200) {
                    // send webhook to discord for alerts
                    throw {
                        message: "Open AI embed generation has failed"
                    };
                }

                const [responseData] = embeddingResponse.data.data;

                const spResponse = await supabaseClient.from("websitecontent")
                    .insert({
                        websitelink_id: websitelinkId,
                        last_trained: new Date().toISOString(),
                        embeddings: responseData.embedding,
                        token_count: embeddingResponse.data.usage.total_tokens,
                        content: trimmedString,
                        sha_checksum: shaChecksum,
                    })
                    .select()
                    .limit(1)
                    .single()

                console.log({ data: spResponse.data, error: spResponse.error });

                await supabaseClient.from("websitelink")
                    .update({
                        is_trained: true,
                    })
                    .eq("id", websitelinkId);

                return res.status(200).json({
                    message: "Successfully created a new websitelink",
                });
            } else {
                throw {
                    message: "Problem saving embedding"
                };
            }
        } catch (error) {
            console.log({ error })
            return res.status(500).json({
                message: "Problem get website links"
            })
        }
    }
}

export default handler;