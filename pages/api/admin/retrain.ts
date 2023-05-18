import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import Cors from "nextjs-cors";
import nextConnect from "next-connect";
import axios from "axios";

const scrapperUrl = process.env.SCRAPER_BACKEND_URL;

const retrain = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200,
    });

    try {
        const headers = req.headers;

        if (!headers["x-api-key"]) {
            throw new Error("Unauthorized");
        }

        if (headers["x-api-key"] && headers["x-api-key"] !== process.env.ADMIN_TOKEN) {
            throw new Error("Unauthorized");
        }

        const body = req.body;

        const response = await axios.post(`${scrapperUrl}/content`, {
            base_link: body.base_link,
            chatbot_id: body.chatbot_id,
            paths: body.paths
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return res.status(200).json(response.data)
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: `Error: \n${error}`
        })
    }
}

const handler: NextApiHandler = nextConnect({ attachParams: true }).post(retrain);

export default handler;