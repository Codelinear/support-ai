import { useStore } from "@/store";
import React, { MutableRefObject } from "react";
import { BeatLoader } from "react-spinners";
import Arrow from "@/components/icons/arrow";
import { Message } from "@/types";

const ChatMessages = ({
  messages,
  chatsContainerRef,
}: {
  messages: Message[];
  chatsContainerRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const responseLoading = useStore((state) => state.responseLoading);
  const setChatStatus = useStore((state) => state.setChatStatus);

  return (
    <div className="h-[95%] w-full relative">
      <div
        ref={chatsContainerRef}
        className="absolute top-0 left-0 h-full w-full overflow-scroll scrollbar-hide pb-20"
      >
        {messages.map((message) =>
          message?.type === "user" ? (
            <p key={message.id} className="text-lg font-semibold my-7">
              {message.content}
            </p>
          ) : (
            <p key={message.id} className="text-base opacity-80">
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
            "linear-gradient(to top, #eee, #eee, #eee, #eee, transparent)",
        }}
        className="absolute h-[5rem] flex items-end z-[1] w-full bottom-0 left-0"
      >
        <div className="w-full absolute bottom-0 left-0 flex items-center justify-between">
          {messages.length >= 2 && (
            <>
              <h2 className="max-[420px]:text-base text-xl sm:text-3xl text-[#D18F5F]">
                Can I help you with anything else?
              </h2>

              <div
                onClick={() => setChatStatus("returnChat")}
                className="flex items-center rounded-lg p-3 cursor-pointer bg-[#FFFFFF66] justify-center"
              >
                <p className="max-[420px]:text-xs">
                  That’s all for now. Thanks!
                </p>
                <div className="bg-[#D18F5F] flex p-2 items-center justify-center rounded-full h-8 w-8 ml-2">
                  <Arrow />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
