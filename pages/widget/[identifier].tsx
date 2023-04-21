/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { LegacyRef, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

interface Chat {
  chat: {
    title: string;
    website_link: string;
    id: number;
  };
}

const coreUrl = process.env.NEXT_PUBLIC_SCRAPER_BACKEND_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Widget: NextPage<Chat> = ({ chat: { title, website_link, id } }) => {
  const [chats, setChats] = useState<
    { message: string; user: "reply" | "sender"; id: number }[]
  >([]);
  const [text, setText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const textareaRef = useRef<LegacyRef<HTMLTextAreaElement>>();
  const chatListRef = useRef<LegacyRef<HTMLDivElement>>();

  const sendText = () => {
    const $text = text;
    setText("");
    setIsSending(true);
    const newChat: any = {
      message: text,
      user: "sender",
      id: chats.length + 1,
    };
    const typingChat: any = {
      message: "Typing...",
      user: "reply",
      id: chats.length + 2,
    };
    setChats((prev) => [...prev, newChat, typingChat]);
    axios({
      method: "post",
      url: `${coreUrl}/core-chat`,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: {
        message: $text,
        website_link,
        chatbot_id: id,
      },
    })
      .then(async (response) => {
        const reader = new Response(response.data)?.body?.getReader();
        let done = false;
        let accumulatedChunks = "";
        while (!done) {
          // @ts-ignore
          const { value, done: doneReading } = await reader?.read();
          if (doneReading) {
            done = true;
          }
          const chunk = new TextDecoder("utf-8").decode(value);
          accumulatedChunks += chunk;
          setChats((prev) => {
            const typingChatIndex = prev.findIndex(
              (item) => item.id === typingChat.id
            );
            const updatedChat: any = {
              message:
                typingChat.message === "Typing..."
                  ? accumulatedChunks
                  : typingChat.message + accumulatedChunks,
              user: typingChat.user,
              id: typingChat.id,
            };
            const updatedChats = [...prev];
            updatedChats.splice(typingChatIndex, 1, updatedChat);
            if (chatListRef.current) {
              //@ts-ignore
              chatListRef.current?.scrollTo({
                //@ts-ignore
                top: chatListRef.current?.scrollHeight,
                behavior: "smooth",
              });
            }
            return updatedChats;
          });
        }
      })
      .catch((error: any) => {
        setIsSending(false);
      });
    setIsSending(false);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white border-0">
      <div className="w-full py-[12px] px-[20px] flex border-b-[1px] border-[rgba(0, 0, 0, 0.1)] z-[99]">
        <h6 className="font-suportal-bold text-[16px]">{title ?? "Chat"}</h6>
      </div>
      <div className="grow relative mt-[16px] px-[1px]">
        <div
          ref={chatListRef as LegacyRef<HTMLDivElement>}
          className="flex flex-col items-end w-full h-auto max-h-[100%] overflow-y-scroll mb-[13px] absolute bottom-0 w-[95%]"
        >
          {chats.map((chat) => {
            return (
              <div
                key={chat.id}
                className={`chat-message ${
                  chat.user === "sender"
                    ? "bg-[#007aff] text-white font-suportal-medium self-end mt-[4px] mb-[8px] ml-[8px]"
                    : "bg-[#e8e8e8] text-black font-suportal-medium self-start mt-[4px] mb-[8px]"
                }`}
              >
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pt-0 pl-[16px] pb-[4px] pr-[16px] max-h-[58px] relative">
        <div
          className="w-full h-full overflow-hidden border-2 border-[#e8e8e8] rounded-[25.5px] place-items-center py-[5px] px-[16px]"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gridTemplateRows: "42px",
            gap: "0px 4px",
          }}
        >
          <textarea
            placeholder="How can I help?"
            name=""
            rows={1}
            ref={textareaRef as unknown as LegacyRef<HTMLTextAreaElement>}
            disabled={isSending}
            value={text}
            className="outline-none h-auto resize-none w-full"
            onChange={(e) => {
              setText(e.target.value);
            }}
            onKeyDown={(e) => {
              // check if Enter key is pressed
              if (e.keyCode === 13) {
                e.preventDefault();
              }
            }}
          ></textarea>
          <button
            disabled={isSending}
            onClick={sendText}
            className="bg-[#007aff] rounded-[50%] flex justify-center place-items-center outline-none h-[28px] w-[28px]"
          >
            <svg
              width={12}
              height={10}
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.14924 0.251051C9.49637 -0.0836838 10.0592 -0.0836838 10.4063 0.251051L15.7397 5.39391C16.0868 5.72864 16.0868 6.27136 15.7397 6.60609L10.4063 11.7489C10.0592 12.0837 9.49637 12.0837 9.14924 11.7489C8.80211 11.4142 8.80211 10.8715 9.14924 10.5368L12.9651 6.85714H0.888889C0.397969 6.85714 0 6.47339 0 6C0 5.52661 0.397969 5.14286 0.888889 5.14286H12.9651L9.14924 1.46323C8.80211 1.1285 8.80211 0.585786 9.14924 0.251051Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
      <a
        target="_blank"
        href="https://www.suportal.co"
        className="flex justify-center space-x-[6px] place-items-center border-t-[1px] border-[rgba(0, 0, 0, 0.1)] p-[5px]"
      >
        <p className="font-suportal-bold text-[11px]">Powered by</p>
        <img src="/logo-svg-1.svg" className="w-[52px]" alt="logo" />
      </a>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  });

  const { data: chatbot, error } = await supabase
    .from("chatbot")
    .select("*")
    .eq("user_id", ctx.query.identifier)
    .limit(1)
    .single();

  return {
    props: {
      chat: {
        title: chatbot?.title ?? "",
        website_link: chatbot?.website_link ?? "",
        id: chatbot?.id,
      },
    },
  };
};

export default Widget;
