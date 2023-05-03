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
      icon: <img className="w-[20px] mr-2" src="/Icon.svg" />,
    },
    {
      label: "Upgrade",
      link: "/billing",
      icon: <img className="w-[20px] mr-2" src="/Icon-1.svg"/>,
    },
  ];


const Navbar = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    return (
     // sidebar
     <div className="h-screen w-2/12 bg-gray-100 h-full z-30">
      
       <div className="max-w-full px-[20px] py-[20px] mx-auto w-full flex-col space-y-[10px]">
        
         <div className="w-full">
           <img className="w-[150px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />
         </div>
 
         <div className="w-full flex-col space-y-2">
            {links.map((link) => (
              <Link
                className="flex rounded-2xl w-full p-[4px] hover:text-suportal-blue hover:bg-gray-300 transition duration-300"
                href={link.link}
                key={link.link}
              >
                {link.icon} {link.label}
              </Link>
            ))}
        </div>

         <div className="w-full flex">
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
