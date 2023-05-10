import React from "react";
import { NextPage } from "next";

const Demo: NextPage = () => {
  return (
    <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
      <h1 className="font-bold text-[22px]">Demo</h1>
      <iframe
        className="w-screen h-[600px] rounded-lg"
        src="https://app.suportal.co/widget/3845fa08-d80b-4d75-89fa-0b1a3c346e2d"
      ></iframe>
    </div>
  );
};

export default Demo;
