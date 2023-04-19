import { createConfiguration, OpenAIApi } from "@fortaine/openai";
import { streamCompletion } from "@fortaine/openai/stream";
import { StreamPayload, chatGPTStream } from "../../../lib/gpt-parser";
import { apiUrl } from "../../../public/widget/embed-string";
import { NextApiRequest, NextApiResponse } from "next";


export type RequestData = {
  website_link: string;
  message: string;
  chatbot_id: number;
};

// export const config = {
//   runtime: "edge",
// };

const configuration = createConfiguration({
  authMethods: {
    apiKeyAuth: {
      accessToken: process.env.OPEN_API_KEY as unknown as string,
    }
  }
});

const openai = new OpenAIApi(configuration);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const body = req.body as RequestData;

      const response = await fetch(`${apiUrl}/api/ai/embed`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      const { context } = response;

      const content = `
            You are helping answer a user's question

            Use the paragraph below as context:
            ${context}

            Their question was: "${body.message}"

            Write an answer to the user's question

            Answer as markdown
        `;

      const data: StreamPayload = {
        model: "text-davinci-003",
        prompt: content,
        max_tokens: 1026,
        temperature: 0,
        stream: true,
      };

      const completion = await openai.createCompletion(data);

      res.setHeader("Content-Type", "text/plain");
      // @ts-ignore
      for await (const message of streamCompletion(completion)) {
        try {
          const parsed = JSON.parse(message);
          const { text } = parsed.choices[0];
          res.write(text);
        } catch (error) {
          console.error("Could not JSON parse stream message", message, error);
        }
      }
      res.end();
    } catch (err) {
      const error: any = err;
      if (error.code) {
        try {
          const parsed = JSON.parse(error.body);
          console.error("An error occurred during OpenAI request: ", parsed);
        } catch (error) {
          console.error("An error occurred during OpenAI request: ", error);
        }
      } else {
        console.error("An error occurred during OpenAI request", error);
      }
      res.status(500).end();
    }
  }
};


export default handler;
