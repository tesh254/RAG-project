import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import widgetString from "../../../public/widget/embed-string";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await Cors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  if (req.method === "GET") {
    try {
      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: chatbot, error } = await supabaseClient
        .from("chatbot")
        .select("*")
        .eq("user_id", req.query.identifier);

      if (chatbot?.length === 0) {
        return res.status(200).json({
          chatbot: null,
        });
      }

      let chat: {
        website_link: string;
        title: string;
      } = chatbot
        ? {
            website_link: chatbot[0].website_link,
            title: chatbot[0].title,
          }
        : { website_link: "", title: "" };

      const script = widgetString(chat.title, chat.website_link);

      res.setHeader("Content-Type", "application/javascript");
      res.status(200).send(script);
    } catch (error) {
      const script = widgetString("", "");

      res.setHeader("Content-Type", "application/javascript");
      res.status(200).send(script);
    }
  }
};

export default handler;
