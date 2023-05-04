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
        label: "Roadmap",
        link: "https://zaaphq.notion.site/Suportal-Roadmap-f6d68bba7ff14be5ab245d33e09c98bb",
        icon: <img className="w-[18px] mr-[5px]" src="/mapicon.svg" />,
      },
  ];


const Navbar = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    return (
     // sidebar
     <div className="sticky top-0 h-screen w-2/12 min-w-[300px] bg-gray-100 h-full z-30">
      
       <div className="max-w-full h-full px-[20px] py-[20px] mx-auto w-full flex-col justify-stretch">
        
         <div className="w-full h-3/6 flex-col space-y-[20px]">
           <img className="w-[150px] ml-[12px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />

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

         <div className="w-full h-3/6 grid grid-cols-1 content-end">
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
