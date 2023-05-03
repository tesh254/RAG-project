/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import Button from "../button";
import toast from "react-hot-toast";
import { Billing } from "../../pages/billing";

type Props = {
  billing: Billing;
};

const ApiKey: FC<Props> = ({ billing }) => {
  const [api, setApi] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedBilling, setSavedBilling] = useState(billing);

  useEffect(() => {
    setSavedBilling((prev) => ({
      ...prev,
      ...billing,
    }));
  }, [billing?.id]);

  useEffect(() => {
    if (savedBilling.id && savedBilling?.openai_api_k) {
      setApi(btoa(savedBilling?.openai_api_k));
    }
  }, [savedBilling.id]);

  const saveApiKey = () => {
    setIsLoading(true);
    axios
      .post(
        "/api/billing/save-api-key",
        {
          api_key: atob(api),
          billing_id: billing.id,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setSavedBilling((prev) => ({
          ...prev,
          ...res.data.billing,
        }));
        toast.success("API Key saved");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="h-auto mt-[32px] mx-auto p-[24px] w-[600px] overflow-y-hidden rounded-[26px] bg-white">
      <p className="text-[18px] text-black">Add your API Key</p>
      <div className="mt-[8px]">
        <div>
          <label className="text-xs">OpenAI API Key</label>
          <div className="flex space-x-[8px] p-[8px] overflow-hidden place-items-center border-suportal-gray-100 border-[2px] rounded-[14px]">
            <input
              type="password"
              value={api}
              className="text-[1rem] grow px-[8px] outline-none"
              onChange={(e) => {
                setApi(btoa(e.target.value));
              }}
              placeholder="Enter key"
            />
            <Button
              isLoading={isLoading}
              kind="primary"
              onClick={() => {
                if (api) {
                  saveApiKey();
                }
              }}
              className=""
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
