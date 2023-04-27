import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext, NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import Plans from "../components/plans";

export type Billing = {
  id?: number;
  billing_id?: string;
  chatbot_id?: number;
  plan_slug?: string;
  plan_label?: string;
  product_id?: string;
};

export type PlansType = {
  active: boolean;
  aggregate_usage: null;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  id: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: {};
  nickname: null;
  product: {
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
  };
};

const BillingPage: NextPage<{ user: User }> = ({ user }) => {
  const [billing, setBilling] = useState<Billing>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState<boolean>(false);
  const [plans, setPlans] = useState<PlansType[]>([]);

  const getOrCreateBilling = useCallback(() => {
    setIsLoading(true);
    axios
      .post(
        "/api/billing/create",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setBilling(res.data.billing);
        setPlans(res.data.plans);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response.data.message);
      });
  }, []);

  console.log(plans);

  // const getStripePlans = useCallback(() => {
  //   setIsFetchingProducts(true);
  //   axios
  //     .get("/api/billing/plans")
  //     .then((res) => {
  //       setIsFetchingProducts(false);
  //       setPlans(res.data.plans);
  //       getOrCreateBilling();
  //     })
  //     .catch((err) => {
  //       setIsFetchingProducts(false);
  //     });
  // }, []);

  useEffect(() => {
    getOrCreateBilling();
  }, [getOrCreateBilling]);

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
                <Plans plans={plans} billing={billing} />
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

  return { props: { user } };
};

export default BillingPage;
