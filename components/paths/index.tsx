import React, { FC, useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { toast } from "react-hot-toast";

type PathsType = {
  id: string;
  path: string;
  chatbot_id: number;
  is_trained: boolean;
  created_at: string;
  updated_at: string;
};

const fetcher: any = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((r) => r.data);

const Paths: FC<{ chatbot_id: number; website_link: string }> = ({
  chatbot_id,
  website_link,
}) => {
  const [query, setQuery] = useState<string>("");
  const [paths, setPaths] = useState<PathsType[]>([]);

  const { data, error, isLoading } = useSWR(
    `/api/chatbot/links/${chatbot_id}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.paths) {
      setPaths(data.paths);
    }
  }, [data, data.paths]);

  useEffect(() => {
    if (query) {
      const results = paths.filter((path) =>
        path.path.includes(query.toLowerCase())
      );

      setPaths(results);
    } else {
      setPaths(data.paths);
    }
  }, [query, data, data.paths, paths]);

  const getContent = (link: string) => {
    return;
  };

  const getLinks = async () => {
    if (chatbot_id) {
      axios
        .post("/api/get-links", {
          website_link: website_link,
          chatbot_id: chatbot_id,
        })
        .then((res) => {
          toast.loading(`We are refreshing the links for ${website_link}`, {
            duration: Infinity,
            position: "top-center",
          });
        })
        .catch((err) => {
          toast.error(
            "Please confirm the link is in the correct format, example: https://<your-domain>"
          );
        });
    }
  };

  return (
    <div className="h-[495px] p-[24px] w-[500px] overflow-y-hidden rounded-[26px] bg-white">
      <div className="flex justify-between space-x-[24px]">
        <p className="text-[18px] text-black">Paths</p>
        <input
          type="search"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
          className="placeholder:text-suportal-blue placeholder:text-opacity-40 grow text-[12px] py-[4px] px-[8px] outline-none ring-[1px] rounded-[8px] bg-suportal-blue bg-opacity-10 text-suportal-blue ring-suportal-blue"
          placeholder="Search path"
        />
        {chatbot_id && website_link && (
          <button
            onClick={getLinks}
            className="flex p-[4px] rounded-[8px] space-x-[4px] place-items-center justify-center text-[16px] bg-suportal-blue text-white"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[10px] w-[10px] text-white"
              aria-hidden="true"
            >
              <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
              <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
            </svg>
            <span className="text-[12px]">Refresh paths</span>
          </button>
        )}
      </div>
      {isLoading && (
        <div className="flex justify-center place-items-center">
          <span>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        </div>
      )}
      {!isLoading && data && (
        <div className="overflow-y-scroll h-full scrollbar-none">
          {data.paths.length > 0 && (
            <>
              {paths.map((path: PathsType) => {
                return (
                  <div
                    className="flex place-items-center justify-between space-x-[8px] space-y-[8px] border-b-[1px] border-suportal-gray-100 py-[8px]"
                    key={path.id}
                  >
                    <p className="text-suportal-gray-dark select-none grow text-[12px]">
                      {path.path}
                    </p>
                    <button
                      onClick={() => {
                        getContent(`${website_link}${path.path}`);
                      }}
                      className="bg-suportal-purple text-suportal-purple hover:bg-opacity-30 place-items-center bg-opacity-10 flex border-[1px] border-suportal-purple p-[4px] rounded-[8px]"
                    >
                      <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="h-[10px] w-[10px]"
                      >
                        <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"></path>
                      </svg>
                      <span className="text-[12px]">train</span>
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Paths;
