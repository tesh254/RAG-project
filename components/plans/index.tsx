import React, { FC, useEffect, useRef } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { useUser } from "@supabase/auth-helpers-react";
import { Billing, PlansType } from "../../pages/billing";
import Button from "../button";
import Checkout from "../checkout";

type Props = {
  plans: PlansType[];
  billing: Billing;
};

const CheckIcon = ({
  className,
  fill,
}: {
  className: string;
  fill: string;
}) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 0C1.79086 0 0 1.79086 0 4V14C0 16.2091 1.79086 18 4 18H14C16.2091 18 18 16.2091 18 14V4C18 1.79086 16.2091 0 14 0H4ZM13.7969 6.91454C14.107 6.60442 14.107 6.10161 13.7969 5.79149C13.4868 5.48137 12.9839 5.48137 12.6738 5.79149L7.41182 11.0535L5.32629 8.96796C5.01616 8.65784 4.51336 8.65784 4.20323 8.96796C3.89311 9.27808 3.89311 9.78089 4.20323 10.091L6.85029 12.7381C7.16042 13.0482 7.66322 13.0482 7.97334 12.7381L13.7969 6.91454Z"
      fill={fill}
    />
  </svg>
);

const Plans: FC<Props> = ({ plans, billing }) => {
  const stripeRef = useRef<Stripe | null>(null);
  const user = useUser();

  useEffect(() => {
    (async () => {
      stripeRef.current = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as unknown as string
      );
    })();
  }, []);

  const changePlan = async (priceId: string) => {
    // @ts-ignore
    const { error } = await stripeRef.current?.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      customerEmail: user?.email,
      successUrl: `${window.location.origin}/billing/success`,
      cancelUrl: `${window.location.origin}/billing/cancel`,
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="select-none flex flex-wrap gap-y-[14px] gap-x-[14px]">
      {[...plans].reverse().map((plan) => {
        return (
          <div
            key={plan.id}
            className={`p-[1rem] rounded-[18px] border-[1px] border-[rgba(83, 90, 116, 0.08)] w-[265px] h-fit min-h-[234px] ${
              plan.product.name === "Developer"
                ? "bg-[#212121] text-white"
                : "bg-white"
            }`}
          >
            <div className="mb-[18px]">
              <h4 className="text-[18px]">{plan.product.name}</h4>
              <h6
                className={`text-[22px] ${
                  plan.product.name === "Developer"
                    ? "text-suportal-purple"
                    : "text-suportal-blue"
                }`}
              >
                ${plan.amount / 100}/mo
              </h6>
            </div>
            <div className="mb-[18px]">
              <div className="flex space-x-[11px] place-items-center mb-[8px]">
                <CheckIcon
                  fill={
                    plan.product.name === "Developer" ? "#8849FF" : "#0C8CFB"
                  }
                  className="w-[18px] h-[18px]"
                />
                <p>
                  {plan.product.metadata.own_api === "true"
                    ? "Use your own API Key"
                    : "No API key required"}
                </p>
              </div>
              <div className="flex space-x-[11px] place-items-center mb-[8px]">
                <CheckIcon
                  fill={
                    plan.product.name === "Developer" ? "#8849FF" : "#0C8CFB"
                  }
                  className="w-[18px] h-[18px]"
                />
                <p>{plan.product.metadata.chats}</p>
              </div>
              <div className="flex space-x-[11px] place-items-center mb-[8px]">
                <CheckIcon
                  fill={
                    plan.product.name === "Developer" ? "#8849FF" : "#0C8CFB"
                  }
                  className="w-[18px] h-[18px]"
                />
                <p>{`${plan.product.metadata.chatbot_count} ChatBot`}</p>
              </div>
            </div>
            <div className="mb-[18px]">
              <Elements stripe={stripeRef.current}>
                <Checkout billing={billing} plan={plan}>
                  <Button
                    kind={
                      plan.product.name === "Developer" ? "third" : "primary"
                    }
                    onClick={() => {}}
                    type="button"
                    className=" py-[7px]"
                    disabled={billing.product_id === plan.id}
                  >
                    {billing.plan_label === plan.product.name
                      ? "Current Plan"
                      : "Upgrade"}
                  </Button>
                </Checkout>
              </Elements>
            </div>
            {plan.product.name === "Developer" && (
              <p className="text-[12px] m-0 p-0 font-normal">
                *Using your own Key will require an OpenAI account.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Plans;
