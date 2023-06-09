import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../../components/layout";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { Billing, PlansType } from "../billing";
import { useEffect, useRef, useState } from "react";
import { MinusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const Integrate: NextPage<{
  user: User;
  billing: Billing | null;
  plans: PlansType[];
  code: string;
  state: string;
  error: string;
}> = ({ user, billing, plans, code, state, error }) => {
  const router = useRouter();
  const isRequestMade = useRef(false);

  useEffect(() => {
    if (code && state && !isRequestMade.current) {
      isRequestMade.current = true;
      axios
        .post(
          `/api/integrate/notion/authorize`,
          {
            code,
            state,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          toast.success("Succesfully integrated to your Notion account");
          router.push("/");
        })
        .catch((err) => {
          // toast.error(
          //   "Unable to connect to your Notion account, try again later"
          // );
          router.push("/");
        });
    }
  }, [code, router, state]);

  return (
    <Layout billing={billing} plans={plans} title="Suportal - Integration">
      {error ? (
        <div className="w-full bg-red-600 p-[16px] flex justify-center rounded-[8px] bg-opacity-20 border-[1px] border-red-600 text-red-600">
          <span>
            Notion integration failed, please try again later
            <br />
          </span>
        </div>
      ) : (
        <div className="w-full bg-green-600 place-items-center space-x-[8px] p-[16px] flex justify-center rounded-[8px] bg-opacity-20 border-[1px] border-green-600 text-green-600">
          <span>Please wait as we finish integrating Notion</span>
          <MinusIcon width="24px" className="animate-spin" />
        </div>
      )}
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
        code: ctx.query.code ?? null,
        state: ctx.query.state ?? null,
        error: ctx.query.error ?? null,
      },
    };
  } catch (error) {
    return {
      props: {
        user,
        code: ctx.query.code ?? null,
        state: ctx.query.state ?? null,
        error: ctx.query.error ?? null,
      },
    };
  }
};

export default Integrate;
