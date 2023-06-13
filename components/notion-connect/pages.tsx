import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PageItem, { IPageProps } from "./page-item";
import { toast } from "react-hot-toast";

const NotionPages = ({
  chatbot_id,
  authorize,
}: {
  chatbot_id: number;
  authorize: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isRequestMadeRef = useRef(false);
  const isTrainingRequestMadeRef = useRef(false);
  const [pageItems, setPageItems] = useState<IPageProps[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  const getPages = useCallback(() => {
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
  }, [chatbot_id]);

  useEffect(() => {
    if (!isRequestMadeRef.current) {
      isRequestMadeRef.current = true;
      getPages();
    }
  }, [chatbot_id, getPages]);

  const trainBlocks = () => {
    if (isTrainingRequestMadeRef.current) {
      isTrainingRequestMadeRef.current = false;
    }
    if (!isTrainingRequestMadeRef.current) {
      isTrainingRequestMadeRef.current = true;
      setIsTraining(true);
      toast.loading(
        "We are training your Notion content, please wait and do not close this page"
      );

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
          getPages();
          toast.dismiss();
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
          {pageItems.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col space-y-[8px]">
              <p>Reconnect Notion</p>
              <button
                onClick={() => {
                  authorize();
                }}
                className="flex w-fit space-x-[8px] place-items-center border-[1px] rounded-[8px] py-[8px] px-[8px] shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[28px] h-[28px]"
                  viewBox="0 0 400 400"
                  fill="none"
                >
                  <path
                    d="M33.9473 18.1239L254.183 1.90564C281.227 -0.413975 288.186 1.13982 305.184 13.4879L375.486 62.899C387.086 71.3959 390.952 73.7092 390.952 82.9717V353.975C390.952 370.959 384.765 381.003 363.133 382.54L107.376 397.984C91.1378 398.759 83.4095 396.444 74.9057 385.629L23.1344 318.458C13.8577 306.095 10 296.844 10 286.022V45.1365C10 31.2473 16.1887 19.6619 33.9473 18.1239Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M254.183 1.90564L33.9473 18.1239C16.1887 19.6619 10 31.2473 10 45.1365V286.022C10 296.844 13.8577 306.095 23.1344 318.458L74.9057 385.629C83.4095 396.444 91.1378 398.759 107.376 397.984L363.133 382.54C384.765 381.003 390.952 370.959 390.952 353.975V82.9717C390.952 74.1922 387.478 71.656 377.238 64.1797C376.674 63.7684 376.091 63.3421 375.486 62.899L305.184 13.4879C288.186 1.13982 281.227 -0.413975 254.183 1.90564ZM113.175 78.5266C92.2938 79.9366 87.5491 80.257 75.6911 70.6238L45.5362 46.6901C42.4606 43.5952 44.0032 39.7345 51.7248 38.9688L263.456 23.5258C281.224 21.9783 290.495 28.165 297.453 33.5669L333.768 59.8199C335.314 60.5888 339.171 65.2155 334.533 65.2155L115.87 78.3453C114.95 78.4068 114.058 78.467 113.194 78.5253L113.178 78.5264L113.175 78.5266ZM88.8193 351.654V121.583C88.8193 111.548 91.9105 106.912 101.178 106.133L352.305 91.4685C360.822 90.6965 364.679 96.1047 364.679 106.133V334.66C364.679 344.705 363.13 353.21 349.216 353.975L108.906 367.879C94.9984 368.644 88.8193 364.019 88.8193 351.654ZM326.053 133.924C327.594 140.88 326.053 147.829 319.085 148.611L307.506 150.918V320.771C297.453 326.175 288.183 329.263 280.458 329.263C268.09 329.263 264.992 325.4 255.728 313.825L179.991 194.927V309.965L203.957 315.373C203.957 315.373 203.957 329.263 184.621 329.263L131.317 332.356C129.768 329.263 131.317 321.549 136.724 320.003L150.634 316.148V164.048L131.32 162.5C129.771 155.544 133.629 145.516 144.455 144.737L201.638 140.883L280.458 261.329V154.778L260.362 152.472C258.819 143.969 264.992 137.794 272.72 137.029L326.053 133.924Z"
                    fill="black"
                  />
                </svg>
                <span className="text-md font-bold">Connect Notion</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotionPages;
