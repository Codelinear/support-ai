"use client";

import Chat from "@/components/chat";
import Contact from "@/components/contact";
import Main from "@/components/main";
import { useStore } from "@/store";
// import { useChat } from "ai/react";
import { ReactNode, useRef } from "react";
import Logo from "@/components/logo";

export default function Home() {
  const chatStatus = useStore((state) => state.chatStatus);

  const page = useRef<ReactNode | null>(null);

  const screen = useStore((state) => state.screen);

  if (screen === "home") {
    page.current = <Main />;
  } else if (screen === "contact") {
    page.current = <Contact />;
  } else if (screen === "chat") {
    page.current = <Chat />;
  }

  return (
    <main className="bg-[#eeeeee] relative h-screen">
      <div
        className={`absolute z-[1] backdrop-blur-3xl h-full ${
          screen === "home" ? "md:px-40" : screen === "chat" ? "xl:px-40" : "xl:px-40"
        } py-28 w-full top-0 left-0`}
      >
        <Logo />
        {page.current}
      </div>
      <div className="absolute top-0 h-full w-full overflow-hidden left-0">
        {chatStatus !== "chatting" && (
          <>
            <div className="bg-[#BE988C] top-[-43%] left-[-39%] h-[1000px] w-[1000px] rounded-full opacity-10 absolute"></div>
            <div className="bg-[#BE988C] top-[18%] left-[57%] h-[1000px] w-[1000px] rounded-full opacity-10 absolute"></div>
          </>
        )}
      </div>
    </main>
  );
}
