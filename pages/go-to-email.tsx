/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "../components/button";

const GoToEmail: NextPage = () => {
  const router = useRouter();
  return (
    <div className="form-base">
      <div className="form">
        <img src="/logo-svg-2.svg" alt="gray-suportal-logo" />
        <h3>Verify your account</h3>
        <h6>
          <span>Click the link send to your email to verify your account.</span>
        </h6>
        <div className="form-items">
          <Button
            className=""
            onClick={() => {
              router.push("/");
            }}
            kind="secondary"
            isLoading={false}
          >
            <span className="text-white">Continue to dashboard</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoToEmail;
