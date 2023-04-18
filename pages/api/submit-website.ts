import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import axios from "axios";

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

        const response = await axios.post(`${process.env.SCRAPER_BACKEND_URL}/suportal-links`, {
            link: body.website_link,
        });

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Problem receiving and processing content"
        })
    }
  }
};

export default handler;
