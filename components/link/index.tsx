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
      <div className="flex place-items-center space-x-[6px] mr-[16px]">
        {path.is_trained && (
          <div className="flex place-items-center space-x-[4px]">
            <div className="h-[8px] w-[8px] bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-400">trained</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PathLink;
