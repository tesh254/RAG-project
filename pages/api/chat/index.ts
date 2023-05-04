import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { Readable, Transform } from 'stream';
import { StreamPayload } from "../../../lib/gpt-parser";
import { apiUrl } from "../../../lib/embed-string";
import { NextApiRequest, NextApiResponse } from "next";


export type RequestData = {
  website_link: string;
  message: string;
  chatbot_id: number;
};

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY as unknown as string,
})

const openai = new OpenAIApi(configuration);

function isJsonParsable(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

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

      const completion = await openai.createCompletion(data, { responseType: "stream" });
      const stream = completion.data as unknown as Readable;

      res.setHeader("Content-Type", "application/octet-stream");

      stream.on("data", (chunk) => {
        let message: any = Buffer.from(chunk).toString();
        message = message.replace(/\n/g, "").trim();
        if (message !== "[DONE]") {
          const crMsg = message.trim().split("data: ").filter((item: string) => item !== "" && item !== "[DONE]");
          if (isJsonParsable(crMsg[0])) {
            const parsedMessage: any = JSON.parse(crMsg[0]);
            const text = parsedMessage.choices[0]?.text.toString();
            return res.write(text);
          }
          return;
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.write(`We are currently facing an issue on processing messages, please try again later`);
      res.end();
    }
  }
};

export default handler;

// stream.data.on('data', (data: string) => {
//   const lines = data.toString().split('\n').filter((line) => line.trim() !== '');
//   for (const line of lines) {
//     const message = line.replace(/^data: /, '');
//     if (message === '[DONE]') {
//       return; // Stream finished
//     }
//     try {
//       const parsed = JSON.parse(message);
//       return parsed.choices[0].text;
//     } catch (error) {
//       console.error('Could not JSON parse stream message', message, error);
//     }
//   }
// });