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
        website_link: req.body.website_link,
        title: req.body.title,
        user_id: user?.id,
      };

      const { data: billing, error: billingError } = await supabaseServerClient.from("billing")
        .select("*")
        .eq("user_id", user?.id)
        .single();


      if (data.length !== 0) {
        const { data: updateData, error: updateError } =
          await supabaseServerClient
            .from("chatbot")
            .update(payload)
            .eq("user_id", user?.id)
            .select();

        if (updateData && updateData[0].website_link !== data[0].website_link) {
          // @ts-ignore
          const { data: result, error } = await supabaseServerClient.from("websitelink").select("*").eq("chatbot_id", updateData[0].id)

          if (result) {
            for (let i = 0; i < result.length; i++) {
              await supabaseServerClient.from("websitelink").delete().eq("id", result[i].id)
            }
          }
        }

        await supabaseServerClient
          .from("billing")
          .update({
            // @ts-ignore
            chatbot_id: updateData?.id,
          }).eq("billing_id", billing?.id)

        return res.status(201).json({
          bot: updateData,
        });
      }



      const { data: saveData, error: saveError } = await supabaseServerClient
        .from("chatbot")
        .insert(payload)
        .select()

      if (billing) {
        await supabaseServerClient
          .from("billing")
          .update({
            // @ts-ignore
            chatbot_id: saveData?.id,
          }).eq("billing_id", billing.id);
      }

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
