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
import { protocol } from "../lib/sanitizer";
import ApiKey from "../components/api-key";

export type Billing = {
  id?: number;
  billing_id?: string;
  chatbot_id?: number;
  plan_slug?: string;
  plan_label?: string;
  product_id?: string;
  subscription_id?: string;
  openai_api_k?: string;
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
  const resetPlan = () => {};

  return (
    <Layout title="Suportal - Billing">
      <div className="w-[700px] p-[24px] mx-auto bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Upgrade</h1>
        {billing && (
          <div className="mt-[20px]">
            <Counter
              billing_id={billing.id as unknown as number}
              plans={plans}
            />
            <Plans resetPlan={resetPlan} plans={plans} billing={billing} />
          </div>
        )}
      </div>
      {billing && <ApiKey billing={billing} />}
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
    console.log({ error });
    return { props: { user, billing: null, plans: null } };
  }
};

export default BillingPage;
