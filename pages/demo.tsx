import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";

const [supabaseClient] = useState(() => createBrowserSupabaseClient({
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
}));


const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
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

export default Demo;
