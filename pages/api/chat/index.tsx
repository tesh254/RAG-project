import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import { StreamPayload, chatGPTStream } from "../../../lib/gpt-parser";

type RequestData = {
  website_link: string;
  message: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

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
        .eq("website_link", body.website_link);

      if (chatbot?.length !== 0) {
        // @ts-ignore
        const support_link = chatbot[0].support_link;

        const content = `
            You are helping answer a user's question

            Their question was: "${body.message}"

            All the support docs are here: ${support_link}

            Write an answer to the user's question

            no markdown, return the response in number bullets
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

        const parsedResponse = await chatGPTStream(data);

        const reader = parsedResponse.getReader();

        const decoder = new TextDecoder();

        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();

          done = doneReading;

          const chunkValue = decoder.decode(value);

          res.write(chunkValue);
        }

        res.end();
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
