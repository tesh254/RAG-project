import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import Cors from "nextjs-cors";
import axios from "axios";
import nextConnect from "next-connect"
import { createClient } from "@supabase/supabase-js"

const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
    await Cors(req, res, {
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: "*",
        optionsSuccessStatus: 200,
    });

    const supabaseClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE as string
    );

    try {
        const headers = req.headers;

        if (!headers["x-api-key"]) {
            throw new Error("Unauthorized");
        }

        if (headers["x-api-key"] && headers["x-api-key"] !== process.env.ADMIN_TOKEN) {
            throw new Error("Unauthorized");
        }

        const { data: users, error } = await supabaseClient.auth.admin.listUsers();

        return res.status(200).json(users.users)
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            // @ts-ignore
            message: `error: ${error.message}`
        })
    }
}

const handler: NextApiHandler = nextConnect({ attachParams: true }).get(getUserById);

export default handler;
