import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext, NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import Plans from "../components/plans";
import Stripe from "stripe";
import Counter from "../components/counter";

export type Billing = {
  id?: number;
  billing_id?: string;
  chatbot_id?: number;
  plan_slug?: string;
  plan_label?: string;
  product_id?: string;
  subscription_id?: string;
};

export type PlansType = {
  active: boolean;
  attributes: [];
  created: number;
  default_price: string;
  description: string | null;
  id: string;
  images: string[];
  livemode: boolean;
  metadata: {
    chatbot_count: string;
    chats: string;
    own_api: string;
    plan_id: string;
  };
  name: string;
  object: string;
  type: string;
  updated: number;
  url: string | null;
  price: {
    unit_amount: number;
    id: string;
  };
};

const BillingPage: NextPage<{
  user: User;
  billing: Billing;
  plans: PlansType[];
}> = ({ user, billing, plans }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState<boolean>(false);

  const resetPlan = () => {
    axios
      .post(
        "/api/billing/reset",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <Layout title="Suportal - Billing">
      <div className="w-[600px] p-[24px] mx-auto bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Upgrade</h1>
        {isLoading ? (
          <div className="w-full justify-center">
            <span>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-suportal-blue place-items-center"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          </div>
        ) : (
          <>
            {billing && (
              <div className="mt-[20px]">
                <Counter
                  billing_id={billing.id as unknown as number}
                  plans={plans}
                />
                <Plans resetPlan={resetPlan} plans={plans} billing={billing} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { user } = session;

  const data = {
    user,
  };

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/billing/create`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const billing = response.data.billing;
    const plans = response.data.plans;
    return { props: { user, billing, plans } };
  } catch (error) {
    console.error(error);
    return { props: { user, billing: null, plans: null } };
  }
};

export default BillingPage;
