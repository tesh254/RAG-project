import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import axios from "axios";

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

      const response = await axios.post(`${scrapperUrl}/links`, {
        website_link: body.website_link,
        chatbot_id: body.chatbot_id
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      return res.status(200).json(response.data);
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Problem processing links"
      })
    }
  }
};

export default handler;
