import React, { FC } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PathsType } from "../paths";
const PathLink: FC<{
  path: PathsType;
  website_link: string;
  refetch: () => void;
  handleRemovedLink: (path_id: number) => void;
}> = ({ path, website_link, handleRemovedLink, refetch }) => {
  const getContent = (link: string, path_id: number, path: string) => {
    axios
      .post("/api/get-content", {
        base_link: link,
        path,
        website_link_id: path_id,
      })
      .then((r) => {
        toast.success(
          `${link}${path} content is being retrieved and trained, this might take a couple of minutes`
        );
      })
      .catch((err) => {
        toast.error(`Problem retrieving content from: ${link}${path}`);
      });
  };

  const deletePath = (path_id: number) => {
    axios
      .patch("/api/get-content", {
        path_id,
      })
      .then((r) => {
        handleRemovedLink(r.data.path_id);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="flex place-items-center justify-between space-x-[8px] space-y-[8px] border-b-[1px] border-suportal-gray-100 py-[8px]">
      <p className="text-suportal-gray-dark select-none grow text-[12px]">
        {path.path}
      </p>
      <div className="flex place-items-center space-x-[6px]">
        <button
          onClick={() => {
            if (!path.is_trained) {
              getContent(`${website_link}`, path.id, path.path);
            }
          }}
          disabled={path.is_trained}
          className={`${
            path.is_trained
              ? "bg-suportal-red text-suportal-red hover:bg-opacity-30 border-suportal-red"
              : "bg-suportal-purple text-suportal-purple hover:bg-opacity-30 border-suportal-purple"
          } place-items-center bg-opacity-10 flex border-[1px] p-[4px] rounded-[8px]`}
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
          <span className="text-[12px]">
            {path.is_trained ? "trained" : "train"}
          </span>
        </button>
        <button
          onClick={() => {
            deletePath(path.id);
          }}
          disabled={path.is_trained}
          className="bg-suportal-red text-suportal-red hover:bg-opacity-30 border-suportal-red place-items-center bg-opacity-10 flex border-[1px] p-[4px] rounded-[8px]"
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-[10px] w-[10px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          <span className="text-[12px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default PathLink;
