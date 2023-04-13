import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../components/layout";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const Dashboard: NextPage = () => {
    return (
        <Layout title="Suportal - Dashboard">
          <section>
            Hello this is the dashbaord
          </section>
        </Layout>
    );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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