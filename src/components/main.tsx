import React, { useState } from "react";
import Arrow from "@/components/icons/arrow";
import { useStore } from "@/store";
import { validateName } from "@/lib/actions/validate-name";
import OrangeButton from "@/components/icons/orange-button";

const Main = () => {
  const [name, setName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [error, setError] = useState("");

  const changeScreen = useStore((state) => state.changeScreen);
  const setUserName = useStore((state) => state.setUserName);

  return (
    <div className="w-[90vw] sm:w-[38.5rem] min-[840px]:mx-0 mx-auto mt-14">
      <h1 className="text-2xl min-[420px]:text-4xl sm:mx-0 sm:text-[3.5rem] sm:leading-[1] min-[840px]:text-start text-center min-[840px]:w-[80%] mb-12 text-[#D18F5F] my-[5rem]">
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

              setError("");

              setNameLoading(true);

              const data = await validateName(name);

              setNameLoading(false);

              if (data.isCorrect) {
                if (data.isCorrect === "false") {
                  setError("Please enter a valid name");
                } else {
                  setUserName(data.isCorrect as string);
                  changeScreen("contact");
                }
              } else {
                setError("Something went wrong");
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

            setError("");

            setNameLoading(true);

            const data = await validateName(name);

            setNameLoading(false);

            if (data.isCorrect) {
              if (data.isCorrect === "false") {
                setError("Please enter a valid name");
              } else {
                setUserName(data.isCorrect as string);
                changeScreen("contact");
              }
            } else {
              setError("Something went wrong");
            }
          }}
        >
          <OrangeButton />
        </button>
      </div>

      {nameLoading && (
        <div className="ml-4 animate-pulse mt-3 text-lg">
          Processing your name
        </div>
      )}

      {error && <div className="ml-4 text-red-600 mt-3 text-lg">{error}</div>}
    </div>
  );
};

export default Main;
