import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../components/layout";
import { User, createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import BotForm from "../components/bot-form";

const Dashboard: NextPage<{ user: User; }> = ({ user }) => {
    return (
        <Layout title="Suportal - Dashboard">
          <BotForm user={user} />
        </Layout>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  console.log(process.env.VERCEL_URL, "[process.env.VERCEL_URL]");

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  const { user } = session

  return { props: { user } }
}

export default Dashboard;