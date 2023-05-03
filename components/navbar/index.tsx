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
      icon: <img className="w-[20px]" src="/Icon.svg" />,
    },
    {
      label: "Upgrade",
      link: "/billing",
      icon: <img className="w-[20px]" src="/Icon-1.svg" />,
    },
  ];


const Navbar = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    return (
     // sidebar
     <div className="h-screen min-w-120 w-120 bg-gray-200 h-[81px] z-30">
      
       <div className="max-w-full px-[20px] py-[18px] mx-auto w-full flex-col space-y-20">
        
         <div className="w-full">
           <img className="w-[144px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />
         </div>
 
         <div className="w-full flex-col">
          <div className="flex-col space-y-20">
            {links.map((link) => (
              <Link
                className="flex w-full p-12 hover:text-suportal-blue hover:bg-slate-400 transition duration-300"
                href={link.link}
                key={link.link}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>

         <div className="w-full flex justify-end">
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
