import React, { useState } from "react";
import Arrow from "@/components/icons/arrow";
import { useStore } from "@/store";
import axios from "axios";

const Main = () => {
  const [name, setName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);

  const changeScreen = useStore((state) => state.changeScreen);
  const setUserName = useStore((state) => state.setUserName);

  return (
    <div className="w-[80vw] sm:w-[28rem] md:mx-0 mx-auto mt-10">
      <h1 className="text-3xl sm:mx-0 mx-4 sm:text-5xl md:text-start text-center md:w-[90%] mb-12 font-bold text-[#D18F5F]">
        Hello! I’m Support.AI. What’s your name?
      </h1>
      <div className="bg-white rounded-full p-[0.6rem] flex justify-between items-center">
        <input
          className="bg-transparent placeholder:text-[#0000004D] text-black px-5 mr-3 w-full text-lg font-medium border-none outline-none"
          placeholder="Hey. I’m J Balvin."
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={nameLoading}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              if (!name) {
                return;
              }

              setNameLoading(true);

              const res = await axios.post("/api/ai/validate/name", { name });

              setNameLoading(false);

              if (res.data.isCorrect.kwargs.content === "false") {
                alert("Please enter a valid name");
              } else {
                setUserName(res.data.isCorrect.kwargs.content);
                changeScreen("contact");
              }
            }
          }}
          type="text"
        />
        <button
          type="button"
          disabled={nameLoading}
          onClick={async () => {
            if (!name) {
              return;
            }

            setNameLoading(true);

            const res = await axios.post("/api/ai/validate/name", { name });

            setNameLoading(false);

            if (res.data.isCorrect.kwargs.content === "true") {
              setUserName(name);
              changeScreen("contact");
            } else {
              alert("Please enter a valid name");
            }
          }}
          className="bg-[#F67B36] flex items-center justify-center rounded-full p-3 w-10 h-10"
        >
          <Arrow />
        </button>
      </div>
      {nameLoading && (
        <div className="ml-4 animate-pulse mt-3 text-lg">
          Processing your name
        </div>
      )}
    </div>
  );
};

export default Main;
