import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import { PlansType } from "../../pages/billing";

type Props = {
  billing_id: number;
  plans: PlansType[];
};

const Counter: FC<Props> = ({ billing_id, plans }) => {
  const [counter, setCounter] = useState({
    limit: 0,
    count: 0,
    suggested: "",
  });

  useEffect(() => {
    if (billing_id) {
      axios
        .post(
          "/api/billing/chat-counter",
          {
            billing_id,
            plans,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setCounter((prev) => ({
            ...prev,
            limit: res.data.limit,
            count: res.data.count,
            suggested: res.data.suggested,
          }));
        });
    }
  }, [billing_id, plans]);

  if (billing_id && counter.limit && counter.suggested) {
    return (
      <div className="bg-suportal-purple px-[14px] py-[26px] flex space-x-[10px] rounded-[17px] text-white mb-[20px] place-items-center">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-[40px] h-[40px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <p>
          Your ChatBot has had {counter.count} chats. Please upgrade to{" "}
          {counter.suggested} to keep your ChatBot working.
        </p>
      </div>
    );
  }

  return <></>;
};

export default Counter;
