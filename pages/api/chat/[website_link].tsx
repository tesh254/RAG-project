import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "GET") {
    console.log(req.query.website_link);
    try {
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: chatbot, error } = await supabaseClient
        .from("chatbot")
        .select("*")
        .eq("website_link", req.query.website_link);

      if (chatbot?.length === 0) {
        return res.status(200).json({
          chatbot: null,
        });
      }

      let chat: any[] = chatbot as unknown as any[];

      return res.status(200).json({
        chatbot: chat[0],
      });
    } catch (error) {
      return res.status(200).json({
        chatbot: null,
      });
    }
  }
};

export default handler;
