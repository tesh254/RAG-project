import React, { FC, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PathsType } from "../paths";
const PathLink: FC<{ path: PathsType; website_link: string }> = ({
  path,
  website_link,
}) => {
  const [isTraining, setIsTraining] = useState<boolean>(false);

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

  return (
    <div className="flex place-items-center justify-between space-x-[8px] space-y-[8px] border-b-[1px] border-suportal-gray-100 py-[8px]">
      <p className="text-suportal-gray-dark select-none grow text-[12px]">
        {path.path}
      </p>
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
    </div>
  );
};

export default PathLink;
