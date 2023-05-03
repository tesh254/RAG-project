import React, { FC, useEffect, useRef } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { useUser } from "@supabase/auth-helpers-react";
import { Billing, PlansType } from "../../pages/billing";
import Button from "../button";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";

type Props = {
  plans: PlansType[];
  billing: Billing;
  resetPlan: () => void;
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

const Plans: FC<Props> = ({ plans, billing, resetPlan }) => {
  const stripeRef = useRef<Stripe | null>(null);
  const user = useUser();

  useEffect(() => {
    (async () => {
      stripeRef.current = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as unknown as string
      );
    })();
  }, []);

  const router = useRouter();

  const changePlan = (priceId: string) => {
    axios
      .post(`/api/billing/checkout`, {
        price_id: priceId,
        billing_id: billing.id,
        customer_id: billing.billing_id,
      })
      .then((res: AxiosResponse) => {
        router.push(res.data.url);
      });
  };

  const newPlans = {
    Free: {
      metadata: ["No API key required", "10 chats/month", "1 ChatBot"],
      plan: plans.find((item) => item.name === "Free"),
    },
    Basic: {
      plan: plans.find((item) => item.name === "Basic"),
      metadata: ["No API key required", "50 chats/month", "1 ChatBot"],
    },
    Pro: {
      plan: plans.find((item) => item.name === "Pro"),
      metadata: ["No API key required", "100 chats/month", "1 ChatBot"],
    },
    // Developer: {
    //   plan: plans.find((item) => item.name === "Developer"),
    //   metadata: ["Use your own API Key", "Unlimited chats", "1 ChatBot"],
    // },
  };

  return (
    <div className="select-none flex flex-wrap gap-y-[14px] gap-x-[14px]">
      {Object.entries(newPlans).map(([key, plan]: any) => {
        return (
          <div
            key={plan.plan.id}
            className={`p-[1rem] rounded-[18px] border-[1px] border-[rgba(83, 90, 116, 0.08)] w-[265px] h-fit min-h-[234px] ${
              plan.plan.name === "Developer"
                ? "bg-[#212121] text-white"
                : "bg-white"
            }`}
          >
            <div className="mb-[18px]">
              <h4 className="text-[18px]">{plan.plan.name}</h4>
              <h6
                className={`text-[22px] ${
                  plan.plan.name === "Developer"
                    ? "text-suportal-purple"
                    : "text-suportal-blue"
                }`}
              >
                ${plan.plan.price.unit_amount / 100}/mo
              </h6>
            </div>
            <div className="mb-[18px]">
              {plan.metadata.map((item: string) => {
                return (
                  <div
                    key={item}
                    className="flex space-x-[11px] place-items-center mb-[8px]"
                  >
                    <CheckIcon
                      fill={
                        plan.plan.name === "Developer" ? "#8849FF" : "#0C8CFB"
                      }
                      className="w-[18px] h-[18px]"
                    />
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
            <div className="mb-[18px]">
              <Button
                kind={plan.plan.name === "Developer" ? "third" : "primary"}
                onClick={() => {
                  changePlan(plan.plan.price.id);
                }}
                type="button"
                className=" py-[7px]"
                disabled={billing.product_id === plan.plan.id}
              >
                {billing.product_id === plan.plan.id
                  ? "Current Plan"
                  : "Upgrade"}
              </Button>
            </div>
            {plan.plan.name === "Developer" && (
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
