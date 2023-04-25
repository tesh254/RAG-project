import React, { useEffect } from "react";
import Layout from "../components/layout";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext, NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getFingerprint } from "../lib/identity";

const Billing: NextPage<{ user: User }> = ({ user }) => {
  useEffect(() => {
    const fingerprint = getFingerprint();

    console.log(fingerprint);
  }, []);

  return (
    <Layout title="Suportal - Billing">
      <div></div>
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

export default Billing;
