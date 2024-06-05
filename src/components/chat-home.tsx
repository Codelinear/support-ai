import React, { useCallback } from "react";
import QuestionMark from "./icons/question-mark";
import { chatHomePrompts } from "@/constants/array";
import { useStore } from "@/store";

const ChatHome = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const chatStatus = useStore((state) => state.chatStatus);
  const setChatStatus = useStore((state) => state.setChatStatus);
  const setResponseLoading = useStore((state) => state.setResponseLoading);

  const onPromptClick = useCallback(
    async (prompt: string) => {
      if (chatStatus !== "chatting") {
        setChatStatus("chatting");
      }

      const humanMessage = {
        type: "user",
        content: prompt,
      };

      setMessages((prev) => [...prev, humanMessage]);

      setResponseLoading(true);

      const res = await fetch("/api/ai/ask", {
        method: "POST",
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();

      setResponseLoading(false);

      setMessages((prev) => [...prev, data.message]);
    },

    [chatStatus, setChatStatus, setMessages, setResponseLoading]
  );

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <h1 className="text-4xl lg:text-5xl w-3/4 max-[420px]:w-full max-[420px]:text-center md:w-1/2 flex flex-col justify-between font-bold text-[#D18F5F]">
        {chatStatus === "startChat"
          ? "Thanks a lot Ricky! How can I help you?"
          : "It was great talking to you Ricky. See you!"}
      </h1>
      <div className="w-full mb-10 lg:grid hidden grid-cols-3 grid-rows-1">
        {chatHomePrompts.map((prompt, index) => (
          <div
            key={prompt.id}
            className={`p-4 h-32 cursor-pointer rounded-xl bg-white ${
              index === 1 && "mx-3"
            }`}
            onClick={() => onPromptClick(prompt.content)}
          >
            <div className="bg-[#D18F5F] mb-2 rounded-full h-9 w-9 flex items-center justify-center">
              <QuestionMark />
            </div>
            <p className="font-semibold text-base text-start">
              {prompt.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHome;
