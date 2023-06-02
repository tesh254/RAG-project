import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import axios from "axios";

const scrapperUrl = process.env.SCRAPER_BACKEND_URL;

/**
 * @swagger
 * /api/get-links:
 *   post:
 *     description: makes a request to the scrapper to get links for a website link tied to a chatbot
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                website_link:
 *                  type: string
 *                chatbot_id:
 *                  type: string
 *              required:
 *                - website_link
 *                - chatbot_id
 *     responses:
 *       200:
 *         description: message
 */

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
