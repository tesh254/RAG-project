import Stripe from "stripe";

const pkKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as unknown as string;
const skKey = process.env.STRIPE_SECRET_KEY as unknown as string;

const publicStripe = new Stripe(pkKey, {
    apiVersion: '2022-11-15',
});

const privateStripe = new Stripe(skKey, {
    apiVersion: '2022-11-15',
});

const stripeObj = {
    public: publicStripe,
    private: privateStripe,
}

export default stripeObj;
