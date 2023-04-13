/* eslint-disable @next/next/no-img-element */
import React from "react";
import Button from "../button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const Navbar = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  return (
    <div className="w-full bg-white fixed top-0 h-[81px]">
      <div className="max-w-screen-lg py-[20px] mx-auto w-full flex place-items-center justify-between">
        <img className="w-[144px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />
        <Button
          onClick={() => {
            supabaseClient.auth.signOut();
            router.push("/login");
          }}
          kind="primary"
          className=""
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
