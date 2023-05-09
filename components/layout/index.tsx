import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import Navbar from "../navbar";
import Script from "next/script";
import { Billing, PlansType } from "../../pages/billing";
import Plans from "../plans";

export default function Layout({
  children,
  title = "Suportal",
  billing,
  plans,
}: {
  children: ReactNode;
  title?: string;
  billing: Billing | null;
  plans: PlansType[];
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

      {process.env.NODE_ENV === "development" && (
        <Script
          strategy="afterInteractive"
          src="http://localhost:3000/api/widget/ea8a05af-102b-4862-828b-530489106e52"
        />
      )}
      <div className="w-screen flex flex-row justify-between">
        <Navbar />
        <main id="skip" className="w-10/12 bg-white flex">
          {billing?.product_id && (
            <section className="w-full p-[30px] flex-col justify-start">
              {children}
            </section>
          )}
          {!billing?.product_id && (
            <section className="w-full p-[30px] flex-col justify-start">
              <p className="my-[8px] text-2xl">
                Before you can create a Suportal subscribe to a plan
              </p>
              <Plans resetPlan={() => {}} plans={plans} billing={billing as unknown as Billing} />
            </section>
          )}
        </main>
      </div>
    </>
  );
}
