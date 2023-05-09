import React from "react";
import Layout from "../components/layout";
import { GetServerSidePropsContext, NextPage } from "next";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { Billing, PlansType } from "./billing";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";


const Demo: NextPage<{
  user: User;
  billing: Billing | null;
  plans: PlansType[];
}> = ({ user, billing, plans }) => {
    return (
    <Layout title="Suportal - Demo" billing={billing} plans={plans}>
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe 
            className="w-full h-[600px] rounded-lg"
            src="https://app.suportal.co/widget/3845fa08-d80b-4d75-89fa-0b1a3c346e2d">
        </iframe>      
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { user } = session;

  try {
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/billing`,
      {
        user,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      props: { user, billing: data.data.billing, plans: data.data.plans },
    };
  } catch (error: unknown) {
    return { props: { user } };
  }
};

export default Demo;
