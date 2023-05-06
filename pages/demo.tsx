import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";


const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe 
            class="w-full h-40 rounded-lg"
            src="https://app.suportal.co/widget/${user.id}">
        </iframe>      
      </div>
    </Layout>
  );
};

export default Demo;
