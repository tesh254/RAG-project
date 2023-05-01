/* eslint-disable @next/next/no-img-element */
import React from "react";
import Button from "../button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Link from "next/link";

const links = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Billing",
    link: "/billing",
  },
];

const Navbar = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  return (
    <div className="w-full bg-white fixed top-0 h-[81px] z-30">
      <div className="max-w-screen-lg px-[16px] py-[20px] mx-auto w-full flex place-items-center justify-between">
        <img
          className="w-[144px]"
          src="/logo-svg-1.svg"
          alt="gray-suportal-logo"
        />
        <div className="flex space-x-[64px]">
          {links.map((link) => {
            return (
              <Link className="hover:text-suportal-blue transition duration-300" href={link.link} key={link.link}>
                {link.label}
              </Link>
            );
          })}
        </div>
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
