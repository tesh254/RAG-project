import { StreamPayload, chatGPTStream } from "../../../lib/gpt-parser";
import { apiUrl } from "../../../lib/embed-string";

export type RequestData = {
  website_link: string;
  message: string;
  chatbot_id: number;
};

export const config = {
  runtime: 'edge',
};

const handler = async (req: any) => {
  if (req.method === "POST") {
    try {
      const body = (await req.json()) as RequestData;

      const response = await fetch(`${apiUrl}/api/ai/embed`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      const { context, api_key } = response;

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

      const stream = await chatGPTStream(data, api_key);

      return new Response(stream);
    } catch (err) {
      console.log(err)
    }
  }
};

export default handler;
