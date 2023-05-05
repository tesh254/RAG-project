import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { User } from "@supabase/supabase-js";
import { GetServerSidePropsContext, NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import Counter from "../components/counter";
import { protocol } from "../lib/sanitizer";
import ApiKey from "../components/api-key";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "../components/button";

const Demo: NextPage = () => {
  const router = useRouter();
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
      </div>
    </Layout>
  );
};


export default Demo;
