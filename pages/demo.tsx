import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";

const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe src="https://app.suportal.co/widget/70697327-fe80-499e-86e7-97ff16616396" width="100%" height="300" style="border:1px solid black;">
        </iframe>      
      </div>
    </Layout>
  );
};

export default Demo;
