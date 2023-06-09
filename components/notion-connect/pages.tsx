import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PageItem, { IPageProps } from "./page-item";

const NotionPages = ({ chatbot_id }: { chatbot_id: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isRequestMadeRef = useRef(false);
  const isTrainingRequestMadeRef = useRef(false);
  const [pageItems, setPageItems] = useState<IPageProps[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    if (!isRequestMadeRef.current) {
      isRequestMadeRef.current = true;
      setIsLoading(true);
      axios
        .post(`/api/integrate/notion/data/pages`, {
          chatbot_id,
        })
        .then((res) => {
          setPageItems(res.data.results);
        })
        .catch((err) => {
          setPageItems([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [chatbot_id]);

  const trainBlocks = () => {
    if (isTrainingRequestMadeRef.current) {
      isTrainingRequestMadeRef.current = false;
    }
    if (!isTrainingRequestMadeRef.current) {
      isTrainingRequestMadeRef.current = true;
      setIsTraining(true);

      axios
        .post(`/api/integrate/notion/data/pages/train`, {
          chatbot_id,
          pages: pageItems,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(() => {
          setIsTraining(false);
        });
    }
  };

  return (
    <div className="w-full overflow-y-scroll">
      {isLoading && (
        <div className="w-full flex justify-center">
          <Loader2 className="animate-spin text-suportal-purple" />
        </div>
      )}
      {!isLoading && (
        <div className="w-full flex flex-col space-y-[4px] h-[400px] divide-y">
          <div className="flex justify-between place-items-center">
            <p className="text-[18px] text-black">Pages</p>
            <button
              onClick={trainBlocks}
              className="flex space-x-[4px] p-[8px] rounded-[8px] place-items-center justify-center text-[16px] bg-suportal-purple text-white"
            >
              {isTraining && <Loader2 className="animate-spin" />}
              <span className="text-[12px]">Train</span>
            </button>
          </div>
          {pageItems.map((pageItem) => {
            return <PageItem pageItem={pageItem} key={pageItem.id} />;
          })}
        </div>
      )}
    </div>
  );
};

export default NotionPages;
