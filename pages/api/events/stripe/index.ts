import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { buffer } from "micro";
import stripeObj from '../../../../lib/stripe';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = stripeObj.private;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as unknown as string;

export const config = {
    api: {
        bodyParser: false,
    },
};


const handleStripeWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseServerClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
    const sig = req.headers['stripe-signature'] || '';
    let event: Stripe.Event = {
        type: "",
        id: '',
        object: 'event',
        api_version: null,
        created: 0,
        data: {
            object: {}
        },
        livemode: false,
        pending_webhooks: 0,
        request: null
    };

    const buf = await buffer(req)

    try {
        event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(`⚠️ Error verifying Stripe signature: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }

    switch (event.type) {
        case 'customer.subscription.created': {
            const subscription = event.data.object;
            console.log({ subscription, type: event.type });
            // handle subscription created event
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription: any = event.data.object;
            console.log({ subscription, type: event.type });
            // handle subscription deleted or updated event

            const { data: billing } = await supabaseServerClient
                .from("billing")
                .select("id")
                .eq("subscription_id", subscription.id)
                .single()

            if (billing) {
                await supabaseServerClient
                    .from("billing")
                    .update({
                        is_paid: true,
                        next_billing: new Date(subscription.current_period_end).toISOString(),
                        product_id: process.env.STRIPE_PRICING_DEFAULT_API_ID,
                    });
            }

            break;
        }

        case 'customer.subscription.updated': {
            const subscription: any = event.data.object;
            const { data: billing } = await supabaseServerClient
                .from("billing")
                .select("id")
                .eq("subscription_id", subscription.id)
                .single();

            if (billing) {
                await supabaseServerClient
                    .from("billing")
                    .update({
                        is_paid: true,
                        next_billing: new Date(subscription.current_period_end).toISOString(),
                    });
            }
            // handle subscription deleted or updated event
            break;
        }

        case 'invoice.paid': {
            const invoice: any = event.data.object;
            const { data: billing } = await supabaseServerClient
                .from("billing")
                .select("id")
                .eq("subscription_id", invoice.subscription)
                .single();

            if (billing) {
                await supabaseServerClient
                    .from("billing")
                    .update({
                        is_paid: true,
                        next_billing: new Date(invoice.period_end).toISOString(),
                    });
            }

            break;
        }

        case 'invoice.payment_failed': {
            const invoice: any = event.data.object;
            const { data: billing } = await supabaseServerClient
                .from("billing")
                .select("id")
                .eq("subscription_id", invoice.subscription)
                .single()

            if (billing) {
                await supabaseServerClient
                    .from("billing")
                    .update({
                        is_paid: true,
                        next_billing: new Date(invoice.period_end).toISOString(),
                        product_id: process.env.STRIPE_PRICING_DEFAULT_API_ID,
                    });
            }
            break;
        }

        default: {
            break;
        }
    }

    res.json({ received: true });
};

const handler = nc({ attachParams: true }).post(handleStripeWebhook);

export default handler;
