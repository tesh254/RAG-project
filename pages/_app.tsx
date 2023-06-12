import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import 'swagger-ui-react/swagger-ui.css';
import "../styles/globals.css";
import "../components/input/input.css";
import "../components/auth-form/auth-form.css";
import "../components/button/button.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient({
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }));

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={{
        ...pageProps.initialSession,
      }}
    >
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
