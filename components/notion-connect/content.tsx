import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const NotionContent = ({ chatbot_id }: { chatbot_id: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isRequestMadeRef = useRef(false);

  useEffect(() => {
    if (!isRequestMadeRef.current) {
      isRequestMadeRef.current = true;
      setIsLoading(true);
      axios
        .post(`/api/integrate/notion/data/databases`, {
          chatbot_id,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [chatbot_id]);

  return (
    <div className="w-full">
      {isLoading && (
        <div className="w-full flex justify-center">
          <Loader2 className="animate-spin text-suportal-purple" />
        </div>
      )}
    </div>
  );
};

export default NotionContent;
