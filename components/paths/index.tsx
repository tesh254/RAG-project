import React, { FC, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import axios from "axios";
import { toast } from "react-hot-toast";
import PathLink from "../link";
import Tabs from "../tabs";
import NotionConnect from "../notion-connect";

export type PathsType = {
  id: number;
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
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { data, error, isLoading } = useSWR(
    `/api/chatbot/links/${chatbot_id}`,
    fetcher
  );

  const getContent = (link: string, paths: string[]) => {
    setIsFetching(true);
    axios
      .post("/api/get-content", {
        base_link: link,
        paths,
        chatbot_id: chatbot_id,
      })
      .then((r) => {
        toast.success(
          `${link} content is being retrieved and trained, this might take a couple of minutes`
        );
        setIsFetching(false);
      })
      .catch((err) => {
        toast.error(`Problem retrieving content from: ${link}`);
        setIsFetching(false);
      });
  };

  const refetch = useCallback(() => {
    setIsFetching(true);
    axios
      .get(`/api/chatbot/links/${chatbot_id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsFetching(false);
        setPaths(res.data.paths);
      })
      .catch((err) => {
        setIsFetching(false);
      });
  }, [chatbot_id]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 200000);

    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  useEffect(() => {
    if (data && data.paths) {
      setPaths(data?.paths);
    }
  }, [data, data?.paths]);

  useEffect(() => {
    if (query) {
      const results = paths.filter((path) =>
        path.path.includes(query.toLowerCase())
      );

      setPaths(results);
    } else {
      setPaths(data?.paths);
    }
  }, [query, data, data?.paths, paths]);

  const getLinks = async () => {
    if (chatbot_id) {
      setIsFetching(true);
      axios
        .post("/api/get-links", {
          website_link: website_link,
          chatbot_id: chatbot_id,
        })
        .then((res) => {
          setIsFetching(false);
          toast.loading(
            `We are refreshing the links for ${website_link}, this will take close to 10 minutes, you can make a coffee ☕️ in the meantime, the links section will refresh in 20 seconds`,
            {
              duration: 10000,
              position: "top-center",
            }
          );
          setTimeout(() => {
            window.location.reload();
          }, 20000);
        })
        .catch((err) => {
          setIsFetching(false);
        });
    }
  };

  return (
    <div className="h-[495px] px-[24px] w-[500px] rounded-[26px] bg-white">
      <Tabs
        tabs={{
          "Website Paths": {
            id: 1,
            content: (
              <>
                <div className="flex justify-between space-x-[24px] pb-[16px]">
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
                  <div className="flex space-x-[4px]">
                    {chatbot_id && website_link && data && data.paths && (
                      <button
                        onClick={() => getContent(website_link, data.paths)}
                        className="flex p-[8px] rounded-[8px] place-items-center justify-center text-[16px] bg-suportal-purple text-white"
                      >
                        {isFetching && (
                          <svg
                            className="animate-spin h-[10px] w-[10px] text-white"
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
                        )}
                        <span className="text-[12px]">Train</span>
                      </button>
                    )}
                    {chatbot_id && website_link && (
                      <button
                        onClick={getLinks}
                        className="flex p-[8px] rounded-[8px] space-x-[4px] place-items-center justify-center text-[16px] bg-suportal-blue text-white"
                      >
                        {isFetching && (
                          <svg
                            className="animate-spin h-[10px] w-[10px] text-white"
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
                        )}
                        {isFetching && (
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
                        )}
                        <span className="text-[12px]">Refresh links</span>
                      </button>
                    )}
                  </div>
                </div>
                {isLoading ||
                  (isFetching && (
                    <div className="flex justify-center place-items-center">
                      <span>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-suportal-purple"
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
                  ))}
                {!isLoading && !isFetching && data && (
                  <div className="overflow-y-scroll h-full scrollbar-none pb-[24px]">
                    {data?.paths.length > 0 && (
                      <>
                        {paths?.map((path: PathsType) => {
                          return (
                            <PathLink
                              refetch={refetch}
                              key={path.id}
                              website_link={website_link}
                              path={path}
                              handleRemovedLink={(path_id) => {
                                if (data && data.paths) {
                                  const $newPaths = data.paths.filter(
                                    (item: PathsType) => item.id != path_id
                                  );
                                  setPaths($newPaths);
                                }
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </>
            ),
          },
          Notion: {
            id: 2,
            content: <NotionConnect chatbot_id={chatbot_id} />,
          },
        }}
      />
    </div>
  );
};

export default Paths;
