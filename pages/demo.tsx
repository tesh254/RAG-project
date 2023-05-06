import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { User } from "@supabase/supabase-js";

const script = (
    <span>
      {`<script`}
      <br />
      {`src="${apiUrl}/widget`}
      <br />
      {`/${user.id}"></script>`}
    </span>
  );

const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe 
            className="w-full h-[600px] rounded-lg"
            src="https://app.suportal.co/widget/{script}">
        </iframe>      
      </div>
    </Layout>
  );
};

export default Demo;
