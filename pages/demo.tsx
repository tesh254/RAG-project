import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { User } from "@supabase/supabase-js";
import { useUser } from "@supabase/auth-helpers-react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lkxdecuqbkjplmgsrmrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreGRlY3VxYmtqcGxtZ3NybXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyMjM5MTUsImV4cCI6MTk5Njc5OTkxNX0.Yn3rjhVgvjilpHTOquiE-APYezroxWSFp2BZXLSOSLE';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

const { user: userData, error: userError } = await supabaseClient.auth.getUser(req.headers.get('Authorization')!.replace('Bearer ', ''))

const Demo: NextPage = () => {
    return (
    <Layout title="Suportal - Demo">
      <div className="w-[600px] p-[24px] bg-white rounded-[25px]">
        <h1 className="font-bold text-[22px]">Demo</h1>
        <iframe 
            className="w-full h-[600px] rounded-lg"
            src="https://app.suportal.co/widget/">
        </iframe>      
      </div>
    </Layout>
  );
};

export default Demo;
