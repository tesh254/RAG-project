import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../components/layout";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import BotForm from "../components/bot-form";
import axios from "axios";
import { Billing, PlansType } from "./billing";

const Dashboard: NextPage<{
  user: User;
  billing: Billing | null;
  plans: PlansType[];
}> = ({ user, billing, plans }) => {
  return (
    <Layout title="Suportal - Dashboard" billing={billing} plans={plans}>
      <BotForm user={user} />
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

    console.log(data.data.plans)

    return {
      props: { user, billing: data.data.billing, plans: data.data.plans },
    };
  } catch (error: unknown) {
    console.log(error)
    return { props: { user } };
  }
};

export default Dashboard;
