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
    label: "Upgrade",
    link: "/billing",
  },
];

const Navbar = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    return (
     // sidebar
     <div className="h-screen w-120 bg-gray-200	 h-[81px] z-30">
      
       <div className="max-w-full px-[20px] py-[18px] mx-auto w-full flex-col space-y-20">
        
         <div className="w-full">
           <img className="w-[144px]" src="/logo-svg-1.svg" alt="gray-suportal-logo" />
         </div>
 
         <div className="w-full flex-col justify-center">
          <div className="flex space-x-60">
            {links.map((link) => (
              <Link
                className="hover:text-suportal-blue transition duration-300"
                href={link.link}
                key={link.link}
              >
                {link.label}
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
