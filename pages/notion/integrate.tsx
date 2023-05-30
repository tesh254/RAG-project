import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../../components/layout";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { Billing, PlansType } from "../billing";

const Integrate: NextPage<{
  user: User;
  billing: Billing | null;
  plans: PlansType[];
}> = ({ user, billing, plans }) => {
  return (
    <Layout billing={billing} plans={plans} title="Suportal - Integration">
      <div>
        
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
        desitination: "/login",
        permanent: false,
      },
    };
  }

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
      props: {
        user,
        billing: data.data.billing,
        plans: data.data.plans,
      },
    };
  } catch (error) {
    return {
      props: {
        user,
      },
    };
  }
};


export default Integrate;