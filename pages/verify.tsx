/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "../components/button";

const Verify: NextPage = () => {
    const router = useRouter();
  return (
    <div className="form-base">
      <div className="form">
        <img src="/logo-svg-2.svg" alt="gray-suportal-logo" />
        <h3>Your account has been verified</h3>
        <h6>
          <span>Click the link to send you to the dashboard</span>
        </h6>
        <div className="form-items">
          <Button
            className=""
            onClick={() => {
                router.push("/dashboard");            }}
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

export default Verify;
