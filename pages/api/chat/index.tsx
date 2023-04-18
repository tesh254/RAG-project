import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { StreamPayload, chatGPTStream } from "../../../lib/gpt-parser";

type RequestData = {
  website_link: string;
  message: string;
};

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request) => {
  if (req.method === "POST") {
    try {
      const body = (await req.json()) as RequestData;

      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: chatbot, error } = await supabaseClient
        .from("chatbot")
        .select("*")
        .eq("website_link", body.website_link);

      if (chatbot?.length !== 0) {
        // @ts-ignore
        const content = `
            You are helping answer a user's question

            Their question was: "${body.message}"

            All the support docs are here: ${body.website_link}

            Write an answer to the user's question in markdown format
        `;

        const data: StreamPayload = {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content }],
          presence_penalty: 0,
          stream: true,
          temperature: 0.7,
          top_p: 1,
          max_tokens: 1026,
          frequency_penalty: 0,
          n: 1,
        };

        const stream = await chatGPTStream(data);

        return new Response(stream);
      } else {
        throw {
          message:
            "Sorry, there was an error while processing your request. Please try again later or contact support if the problem persists.",
        };
      }
    } catch (error) {
      // @ts-ignore
      return res.status(500).send(error.message);
    }
  }
};

export default handler;
