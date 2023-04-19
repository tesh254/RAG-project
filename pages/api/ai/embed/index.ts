import { createClient } from "@supabase/supabase-js";
import { cosSimilarity, trimStr } from "../../../../lib/sanitizer";
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const openAiKey = process.env.OPEN_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const body = req.body;

      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: chatbot, error } = await supabaseClient
        .from("chatbot")
        .select("*")
        .eq("id", body.chatbot_id)
        .limit(1)
        .single();

      if (!chatbot) {
        throw new Error("Suportal owner has not yet created a bot");
      }

      const { data: paths, error: pathsError } = await supabaseClient
        .from("websitelink")
        .select("*")
        .eq("chatbot_id", body.chatbot_id)
        .eq("is_trained", true);

      if (pathsError) {
        throw pathsError;
      }

      // @ts-ignore
      const allPathsIds: number[] = paths?.map((item) => item.id);

      const { data: webContent, error: contentError } = await supabaseClient
        .from("websitecontent")
        .select("id,embeddings,content")
        .in("websitelink_id", allPathsIds);

      const query = body.message;

      const sanitizedQuery = trimStr(query);

      const configuration = new Configuration({
        apiKey: openAiKey,
      });

      const openai = new OpenAIApi(configuration);

      const moderationResponse = await openai.createModeration({
        input: sanitizedQuery,
      });

      const [results] = moderationResponse.data.results;

      if (results.flagged) {
        throw {
          message: "Flagged content",
        };
      }

      const embeddingQuery = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: sanitizedQuery,
      });

      if (embeddingQuery.status !== 200) {
        throw {
          message: "Chat is facing a couple of issues, please try again later",
        };
      }

      const [{ embedding }] = embeddingQuery.data.data;

      let savedContent = webContent as unknown as {
        embeddings: string;
        id: number;
        content: string;
      }[];
      let selectedRecord = [-1, savedContent[0].id];
      for (let i = 0; i < savedContent.length; i++) {
        const result = cosSimilarity(
          JSON.parse(savedContent[i].embeddings),
          embedding,
          savedContent[i].id
        );

        if (result[0] > selectedRecord[0]) {
          selectedRecord[0] = result[0];
          selectedRecord[1] = i;
        }
      }

      return res.status(200).json({
        context: savedContent[selectedRecord[1]].content,
      });
    } catch (error) {
      res.status(500).json({
        // @ts-ignore
        message: error.message,
      });
    }
  }
};

export default handler;