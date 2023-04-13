import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "../navbar";
import Script from "next/script";

export default function Layout({
  children,
  title = "Suportal",
}: {
  children: ReactNode;
  title?: string;
}) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title || title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={title} name="description" />
        <meta
          property="og:url"
          content={`https://fonta.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title || title} />
        <meta property="og:description" content={title} />
        <meta property="og:title" content={title || title} />
        {/* <meta property="og:image" content={meta.cardImage} /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={title || title} />
        <meta name="twitter:description" content={title} />
        {/* <meta name="twitter:image" content={meta.cardImage} /> */}
      </Head>
      <Script strategy="afterInteractive" src="/widget/embed.js" />
      <Navbar />
      <main id="skip" className="bg-suportal-bg mt-[80px]">
        <section className="max-w-screen-lg mx-auto px-2 py-[16px] min-h-screen">
          {children}
        </section>
      </main>
    </>
  );
}
