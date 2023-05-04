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
      icon: <img className="w-[18px] mr-[5px]" src="/Icon.svg" />,
    },
    {
      label: "Upgrade",
      link: "/billing",
      icon: <img className="w-[18px] mr-[5px]" src="/Icon-1.svg"/>,
    },
    {
        label: "Support",
        link: "https://suportal.co/support",
        icon: <img className="w-[18px] mr-[5px]" src="/Icon.svg" />,
      },
  ];


const Navbar = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    return (
     // sidebar
     <div className="relative h-screen w-2/12 bg-gray-100 h-full z-30">
      
       <div className="max-w-full h-full px-[20px] py-[20px] mx-auto w-full flex-col justify-stretch">
        
         <div className="w-full h-3/6">
           <img className="w-[150px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />

           <div className="w-full flex-col">
            {links.map((link) => (
              <Link
                className="flex rounded-2xl w-full p-[12px] hover:text-suportal-blue hover:bg-gray-300 transition duration-300"
                href={link.link}
                key={link.link}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            </div>
         </div>

         <div className="w-full flex h-3/6 justify-end">
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
     </div>
  );
};

export default Navbar;
