import React, { useEffect, useState, FC } from "react";
import useSWR from "swr";
import axios from "axios";
import Input from "../input";
import Button from "../button";
import { toast } from "react-hot-toast";
import { User } from "@supabase/auth-helpers-nextjs";
import { apiUrl } from "../../public/widget/embed-string";
import Paths from "../paths";

const fetcher: any = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((r) => r.data);

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

const BotForm: FC<{ user: User }> = ({ user }) => {
  const { data, error, isLoading, mutate } = useSWR("/api/chatbot", fetcher);
  const [state, setState] = useState({
    title: "",
    website_link: "",
  });
  const [updating, setUpdating] = useState(false);

  const updateBot = async () => {
    if (!state.title) {
      toast.error("Please provide Suportal title");
      return;
    }

    if (!state.website_link) {
      toast.error("Please provide Suportal website link");
      return;
    }

    if (!isValidUrl(state.website_link)) {
      toast.error("Please provide a valid Suportal website link");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.post("/api/chatbot", state, {
        withCredentials: true,
      });

      setUpdating(false);
      toast.success("Suportal updated");
    } catch (error) {
      console.log({ error });
      toast.error(
        "Sorry, there was a problem faced while updating your suportal"
      );
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !error && typeof data !== "string") {
      setState((prev) => ({
        ...prev,
        title: data?.bot?.title ?? "",
        website_link: data?.bot?.website_link ?? "",
      }));
    }

    if (error) {
      toast.error(
        "Sorry, there was a problem faced while updating your suportal"
      );
    }
  }, [data?.bot?.title, data?.bot?.website_link, isLoading, error, data]);

  const onChange = (name: string, value: string | number) => {
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const script = (
    <span>
      {`<script`}
      <br />
      {`src="${apiUrl}/api/widget`}
      <br />
      {`/${user.id}"></script>`}
    </span>
  );

  const copyText = () => {
    if (state.title && state.website_link) {
      // Create a temporary element to hold the text
      const tempElement = document.createElement("textarea");
      tempElement.value = `<script src="${apiUrl}/api/widget/${user.id}"></script>`;
      document.body.appendChild(tempElement);

      // Select the text in the temporary element
      tempElement.select();
      tempElement.setSelectionRange(0, 99999); // For mobile devices

      // Copy the selected text to clipboard
      document.execCommand("copy");

      // Remove the temporary element
      document.body.removeChild(tempElement);

      toast.success("Copied");
    } else {
      toast.error("Please provide a Suportal title and website link");
    }
  };

  return (
    <div className="w-full space-x-[24px] h-auto flex justify-center place-items-center">
      <div className="mx-auto mt-[4px] bg-white w-fit-content p-[24px] rounded-[26px] w-[500px]">
        <h6 className="text-black mb-[32px] text-[25px]">
          Manage Your Suportal
        </h6>
        <div className="flex flex-col space-y-[24px] w-full">
          <div className="base-s-input">
            <label className="">Suportal Title</label>
            <div className="base-s-input-element-container">
              <Input
                name="title"
                inputClassname=""
                onChange={onChange}
                placeholder="Suportal Title"
                type="text"
                value={state.title}
              />
              <Button
                isLoading={updating}
                disabled={isLoading}
                kind="primary"
                className=""
                onClick={updateBot}
              >
                Save
              </Button>
            </div>
          </div>
          <div className="base-s-input">
            <label className="">Website Link</label>
            <div className="base-s-input-element-container">
              <Input
                name="website_link"
                onChange={onChange}
                inputClassname=""
                placeholder="Website link"
                type="text"
                value={state.website_link}
              />
              <Button
                isLoading={updating}
                disabled={isLoading}
                kind="primary"
                className=""
                onClick={updateBot}
              >
                Save
              </Button>
            </div>
          </div>
          <div className="base-s-input">
            <label className="base-label text-suportal-gray-dark">
              Embed code:
            </label>
            <div className="base-s-input-element-container">
              <p className="select-none">{script}</p>
              <Button
                className=""
                kind="primary"
                disabled={isLoading}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.40483 7.03727e-07H9.68608C10.1174 -1.39265e-05 10.4895 -2.66057e-05 10.7959 0.0250128C11.1194 0.0514409 11.4411 0.10979 11.7507 0.267531C12.2126 0.502856 12.5881 0.878355 12.8234 1.34021C12.9811 1.64979 13.0395 1.97151 13.0659 2.29498C13.0909 2.60145 13.0909 2.97354 13.0909 3.40485V4.90909L14.5952 4.90909C15.0265 4.90908 15.3986 4.90906 15.705 4.9341C16.0285 4.96053 16.3502 5.01888 16.6598 5.17662C17.1216 5.41195 17.4971 5.78745 17.7325 6.2493C17.8902 6.55888 17.9486 6.8806 17.975 7.20407C18 7.51053 18 7.88261 18 8.3139V14.5952C18 15.0265 18 15.3986 17.975 15.705C17.9486 16.0285 17.8902 16.3502 17.7325 16.6598C17.4971 17.1216 17.1216 17.4971 16.6598 17.7325C16.3502 17.8902 16.0285 17.9486 15.705 17.975C15.3986 18 15.0265 18 14.5952 18H8.3139C7.88261 18 7.51053 18 7.20407 17.975C6.8806 17.9486 6.55888 17.8902 6.2493 17.7325C5.78745 17.4971 5.41195 17.1216 5.17662 16.6598C5.01888 16.3502 4.96053 16.0285 4.9341 15.705C4.90906 15.3986 4.90908 15.0265 4.90909 14.5952L4.90909 13.0909H3.40485C2.97354 13.0909 2.60145 13.0909 2.29498 13.0659C1.97151 13.0395 1.64979 12.9811 1.34021 12.8234C0.878355 12.5881 0.502856 12.2126 0.267531 11.7507C0.10979 11.4411 0.0514409 11.1194 0.0250128 10.7959C-2.66057e-05 10.4895 -1.39265e-05 10.1174 7.03727e-07 9.68608V3.40483C-1.39265e-05 2.97353 -2.66057e-05 2.60145 0.0250128 2.29498C0.0514409 1.97151 0.10979 1.64979 0.267531 1.34021C0.502856 0.878354 0.878354 0.502856 1.34021 0.267531C1.64979 0.10979 1.97151 0.0514409 2.29498 0.0250128C2.60145 -2.66057e-05 2.97353 -1.39265e-05 3.40483 7.03727e-07ZM6.54546 14.5636C6.54546 15.0354 6.54609 15.3399 6.56503 15.5718C6.58319 15.794 6.61402 15.8764 6.63463 15.9169C6.71307 16.0709 6.83824 16.196 6.99219 16.2745C7.03264 16.2951 7.11505 16.3259 7.33732 16.3441C7.56914 16.363 7.87373 16.3636 8.34546 16.3636H14.5636C15.0354 16.3636 15.3399 16.363 15.5718 16.3441C15.794 16.3259 15.8764 16.2951 15.9169 16.2745C16.0709 16.196 16.196 16.0709 16.2745 15.9169C16.2951 15.8764 16.3259 15.794 16.3441 15.5718C16.363 15.3399 16.3636 15.0354 16.3636 14.5636V8.34546C16.3636 7.87373 16.363 7.56914 16.3441 7.33732C16.3259 7.11505 16.2951 7.03264 16.2745 6.99219C16.196 6.83824 16.0709 6.71307 15.9169 6.63463C15.8764 6.61402 15.794 6.58319 15.5718 6.56503C15.3399 6.54609 15.0354 6.54546 14.5636 6.54546H8.34546C7.87373 6.54546 7.56914 6.54609 7.33732 6.56503C7.11505 6.58319 7.03264 6.61402 6.99219 6.63463C6.83824 6.71307 6.71307 6.83824 6.63463 6.99219C6.61402 7.03264 6.58319 7.11505 6.56503 7.33732C6.54609 7.56914 6.54546 7.87373 6.54546 8.34546V14.5636ZM11.4545 4.90909L8.31392 4.90909C7.88262 4.90908 7.51054 4.90906 7.20407 4.9341C6.8806 4.96053 6.55888 5.01888 6.2493 5.17662C5.78744 5.41195 5.41195 5.78744 5.17662 6.2493C5.01888 6.55888 4.96053 6.8806 4.9341 7.20407C4.90906 7.51054 4.90908 7.88262 4.90909 8.31392L4.90909 11.4545H3.43637C2.96464 11.4545 2.66005 11.4539 2.42823 11.435C2.20596 11.4168 2.12355 11.386 2.0831 11.3654C1.92915 11.2869 1.80398 11.1618 1.72554 11.0078C1.70493 10.9674 1.6741 10.885 1.65594 10.6627C1.637 10.4309 1.63637 10.1263 1.63637 9.65455V3.43636C1.63637 2.96464 1.637 2.66005 1.65594 2.42823C1.6741 2.20596 1.70493 2.12355 1.72554 2.0831C1.80398 1.92915 1.92915 1.80398 2.0831 1.72554C2.12355 1.70493 2.20596 1.6741 2.42823 1.65594C2.66005 1.637 2.96464 1.63637 3.43636 1.63637H9.65455C10.1263 1.63637 10.4309 1.637 10.6627 1.65594C10.885 1.6741 10.9674 1.70493 11.0078 1.72554C11.1618 1.80398 11.2869 1.92915 11.3654 2.0831C11.386 2.12355 11.4168 2.20596 11.435 2.42823C11.4539 2.66005 11.4545 2.96464 11.4545 3.43636V4.90909Z"
                      fill="white"
                    />
                  </svg>
                }
                onClick={copyText}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
      {data && data.bot && data.bot.id && (
        <Paths chatbot_id={data.bot.id} website_link={data.bot.website_link} />
      )}
      {/* {!user.confirmed_at && (
        <div className="space-x-[10px] max-w-[500px] w-full mx-auto bg-suportal-red mt-[17px] py-[16px] flex place-items-center justify-center rounded-[16px]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 7V11M11 15H11.01M21 11C21 16.5228 16.5228 21 11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-white font-suportal-medium">
            Verify your account by clicking the link sent to your email
          </p>
        </div>
      )} */}
    </div>
  );
};

export default BotForm;
