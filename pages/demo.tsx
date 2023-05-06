import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";
import {createClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient (supabaseUrl, supabaseAnonKey)

const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe 
            className="w-full h-[600px] rounded-lg"
            src="https://app.suportal.co/widget/">
        </iframe>      
      </div>
    </Layout>
  );
};

export default Demo;
