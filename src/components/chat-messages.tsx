import { useStore } from "@/store";
import React, { MutableRefObject } from "react";
import { BeatLoader } from "react-spinners";
import Arrow from "@/components/icons/arrow";
import { Message } from "@/types";
import BrownButton from "./icons/brown-button";

const ChatMessages = ({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}) => {
  const responseLoading = useStore((state) => state.responseLoading);
  const setChatStatus = useStore((state) => state.setChatStatus);

  return (
    <div className="min-[450px]:h-[24.5rem] h-[20rem]">
      <div className="h-[95%] w-full relative">
        <div className="absolute top-0 left-0 h-full w-full overflow-y-auto [scrollbar-width:thin] pb-24">
          {messages.map((message) =>
            message?.type === "user" ? (
              <p key={message.id} className="text-lg sm:text-xl my-4 sm:my-7">
                {message.content}
              </p>
            ) : (
              <p key={message.id} className="text-sm sm:text-lg opacity-80">
                {message.content}
              </p>
            )
          )}
          {responseLoading && (
            <BeatLoader
              color="#636363"
              margin={3}
              size={15}
              speedMultiplier={1}
            />
          )}
        </div>
        <div
          style={{
            background:
              "linear-gradient(to top, #eee, #eee, #eee, #eeec, transparent)",
          }}
          className="absolute h-[7rem] flex items-end z-[1] w-full bottom-0 left-0"
        >
          <div className="w-full absolute bottom-[-7px] left-0 flex items-center justify-end min-[450px]:justify-between">
            {messages.length >= 2 && (
              <>
                <h2 className="mr-5 max-[450px]:hidden sm:text-xl md:text-2xl lg:text-3xl text-[#D18F5F]">
                  Can I help you with anything else?
                </h2>

                <div
                  onClick={() => {
                    setMessages([]);
                    setChatStatus("returnChat");
                  }}
                  className="flex items-center rounded-lg p-3 cursor-pointer bg-[#FFFFFF66] justify-center"
                >
                  <p className="max-sm:text-xs max-md:text-sm">
                    That’s all for now. Thanks!
                  </p>
                  <div className="ml-2">
                    <BrownButton />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
