import React, { useCallback, useEffect, useRef, useState } from "react";
import Arrow from "@/components/icons/arrow";
import { useStore } from "@/store";
import ChatHome from "./chat-home";
import ChatMessages from "./chat-messages";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types";
import OrangeButton from "./icons/orange-button";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { chatStatus, setChatStatus, setResponseLoading, responseLoading } =
    useStore();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    [setInput]
  );

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (chatStatus !== "chatting") {
      setChatStatus("chatting");
    }

    const humanMessage: Message = {
      id: uuidv4(),
      type: "user",
      content: input,
    };

    setInput("");

    setMessages((prev) => [...prev, humanMessage]);

    setResponseLoading(true);

    const res = await fetch("/api/ai/ask", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setResponseLoading(false);

    setMessages((prev) => [...prev, data.message]);
  };

  return (
    <div className="w-[85vw] sm:w-[70vw] xl:mx-0 mx-auto xl:w-[59rem] flex flex-col justify-between">
      <div className="w-full">
        {chatStatus !== "chatting" ? (
          <ChatHome setMessages={setMessages} />
        ) : (
          <ChatMessages setMessages={setMessages} messages={messages} />
        )}
      </div>

      <form
        onSubmit={submitHandler}
        className="bg-white rounded-full sm:mt-4 p-[0.6rem] flex w-full items-center"
      >
        <input
          className="bg-transparent placeholder:text-[#0000004D] text-black px-5 mr-3 w-full text-lg font-medium border-none outline-none"
          placeholder="Type your query here."
          value={input}
          onChange={handleInputChange}
          type="text"
        />

        <button type="submit">
          <OrangeButton />
        </button>
      </form>
    </div>
  );
};

export default Chat;
