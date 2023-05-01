const { createClient } = require("@supabase/supabase-js");
const Stripe = require("stripe");
const { addDays } = require("date-fns");

const skKey = process.env.STRIPE_SECRET_KEY;

const reassignBilling = () => {
  const stripe = new Stripe(skKey, {
    apiVersion: "2022-11-15",
  });

  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    supabaseClient
      .from("chatbot")
      .select("id")
      .then((res) => {
        const { data: chatbot, error } = res;

        for (let i = 0; i < chatbot.length; i++) {
          supabaseClient
            .from("billing")
            .select("*")
            .eq("chabot_id", chatbot[i].id)
            .single()
            .then(async ({ data: billing }) => {
              if (!billing) {
                const products = await stripe.products.list({});

                const product = products.data.find(
                  (item) => item.name === "Free"
                );

                const { data: user, error } = await supabaseClient.auth.getUser(
                  chatbot[i].user_id
                );

                let customer;

                const existingCustomer = await stripe.customers.list({
                  email: user.email,
                  limit: 1,
                });

                if (existingCustomer.data.length > 0) {
                  customer = existingCustomer.data[0];
                } else {
                  customer = await stripe.customers.create({
                    email: user.email,
                  });
                }

                supabaseClient.from("billing").insert({
                  is_paid: false,
                  price_id: product.default_price,
                  product_id: product.id,
                  subscription_id: null,
                  user_id: chatbot[i].user_id,
                  next_billing: addDays(new Date(), 30).toISOString(),
                  billing_id: customer.id,
                  openai_api_k: "",
                });
              }
            });
        }
      });
  } catch (error) {
    console.log("Error ", error);

    process.exit(1);
  }
};

reassignBilling();
