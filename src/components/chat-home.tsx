import React, { useCallback, useEffect, useState } from "react";
import QuestionMark from "./icons/question-mark";
import { useStore } from "@/store";
import { v4 as uuidv4 } from "uuid";
import { getRandomSuggestions } from "@/lib/functions/randomSelector";

const ChatHome = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const chatStatus = useStore((state) => state.chatStatus);
  const userName = useStore((state) => state.userName);
  const setChatStatus = useStore((state) => state.setChatStatus);
  const setResponseLoading = useStore((state) => state.setResponseLoading);

  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (chatStatus !== "chatting") {
      setPromptSuggestions(getRandomSuggestions());
    }
  }, [chatStatus]);

  const onPromptClick = useCallback(
    async (prompt: string) => {
      if (chatStatus !== "chatting") {
        setChatStatus("chatting");
      }

      const humanMessage = {
        id: uuidv4(),
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
      <h1 className="max-[520px]:text-3xl text-4xl lg:text-5xl w-3/4 max-[420px]:w-full max-[420px]:text-center md:w-1/2 flex flex-col justify-between font-bold text-[#D18F5F]">
        {chatStatus === "startChat"
          ? `Thanks a lot ${userName}! How can I help you?`
          : `It was great talking to you ${userName}. See you!`}
      </h1>
      <div className="w-full mb-10 flex sm:my-0 my-8 sm:flex-row flex-col justify-between items-center">
        {promptSuggestions.map((prompt) => (
          <div
            key={uuidv4()}
            className={`p-4 w-full h-32 cursor-pointer rounded-xl bg-white my-3 sm:my-6 mx-3`}
            onClick={() => onPromptClick(prompt)}
          >
            <div className="bg-[#D18F5F] mb-2 rounded-full h-9 w-9 flex items-center justify-center">
              <QuestionMark />
            </div>
            <p className="text-base h-12 overflow-y-scroll scrollbar-hide text-start">{prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHome;
