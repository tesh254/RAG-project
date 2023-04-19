import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const scrapperUrl = process.env.SCRAPER_BACKEND_URL;

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  await Cors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "POST") {
    try {
      const body = req.body;

      const response = await axios.post(
        `${scrapperUrl}/suportal-content/${body.website_link_id}`,
        {
          base_link: body.base_link,
          path: body.path,
        }
      );
      console.log({ response: response.data });
      return res.status(200).json(response.data);
    } catch (error) {
      // @ts-ignore
      console.log({ error: error.response.data });
      return res.status(500).json({
        message: "Problem receiving and processing content",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const body = req.body;

      const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );

      const { data: path, error } = await supabaseClient
        .from("websitelink")
        .delete()
        .eq("id", parseInt(body.path_id, 10));

      if (error) {
        throw error;
      }

      return res.status(200).json({ path_id: body.path_id });
    } catch (error) {
      return res.status(500).json({
        message: "Problem experienced deleting website link",
      });
    }
  }
};

export default handler;
