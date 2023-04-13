import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });

  const {
    data: { user },
    error: userError,
  } = await supabaseServerClient.auth.getUser();

  if (userError) {
    return res.status(403).json(userError);
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabaseServerClient
        .from("chatbot")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        throw error;
      }

      return res.status(200).json({
        bots: data,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  if (req.method === "POST") {
    try {
        const { data, error } = await supabaseServerClient
        .from("chatbot")
        .select("*")
        .eq("user_id", user?.id);

        if (error) {
            throw error;
        }

        if (data.length !== 0) {
            return res.status(401).json({
                message: "A Suportal bot already exists in your account",
            });
        }

        const payload = {
            support_link: req.body.support_link,
            website_link: req.body.website_link,
            title: req.body.title,
            user_id: user?.id,
        };

        const { data: saveData, error: saveError } = await supabaseServerClient.from("chatbot").insert(payload);
        
        if (saveError) {
            throw saveError;
        }

        return res.status(201).json({
            chatbot: [saveData],
        });
    } catch (error) {
        return res.status(400).json(error);
    }
  }
};
