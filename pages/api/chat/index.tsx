import { createClient } from "@supabase/supabase-js";
import { OpenAIApi, Configuration } from "openai";
import { StreamPayload, chatGPTStream } from "../../../lib/gpt-parser";
import { cosSimilarity, trimStr } from "../../../lib/sanitizer";
import { NextApiRequest, NextApiResponse } from "next";

type RequestData = {
  website_link: string;
  message: string;
  chatbot_id: number;
};

const openAiKey = process.env.OPEN_API_KEY;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const body = req.body as RequestData;

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

      if (chatbot) {
        const { data: paths, error: pathsError } = await supabaseClient
          .from("websitelink")
          .select("*")
          .eq("chatbot_id", body.chatbot_id)
          .eq("is_trained", true);

        if (error || pathsError) {
          throw error || pathsError;
        }

        let allEmbeds = [];

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
            message:
              "Chat is facing a couple of issues, please try again later",
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

        const content = `
            You are helping answer a user's question

            Use the paragraph below as context:
            ${savedContent[selectedRecord[1]].content}

            Their question was: "${body.message}"

            Write an answer to the user's question

            Answer as markdown
        `;

        const data = {
          model: "text-davinci-003",
          prompt: content,
          max_tokens: 1026,
          temperature: 0,
        };

        const response = await openai.createCompletion(data);

        return res.status(200).send(response.data.choices[0].text);
      } else {
        throw {
          message:
            "Sorry, there was an error while processing your request. Please try again later or contact support if the problem persists.",
        };
      }
    } catch (error) {
      console.log({ error });
      // @ts-ignore
      return res.status(200).send(error.message);
    }
  }
};

export default handler;
