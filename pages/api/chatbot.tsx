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
        bot: data[0],
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
        return res.status(400).json(error);
      }

      const payload = {
        support_link: req.body.support_link,
        website_link: req.body.website_link,
        title: req.body.title,
        user_id: user?.id,
      };

      if (data.length !== 0) {
        const { data: updateData, error: updateError } =
          await supabaseServerClient
            .from("chatbot")
            .update(payload)
            .eq("user_id", user?.id);

        return res.status(201).json({
          bot: updateData,
        });
      }

      const { data: saveData, error: saveError } = await supabaseServerClient
        .from("chatbot")
        .insert(payload);

      if (saveError) {
        return res.status(400).json(error);
      }

      return res.status(201).json({
        bot: [saveData],
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
};

export default handler;
