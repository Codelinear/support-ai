import React, { useState } from "react";
import EmailIcon from "@/components/icons/email";
import Arrow from "@/components/icons/arrow";
import PhoneIcon from "@/components/icons/phone";
import { useStore } from "@/store";

const Contact = () => {
  const [emailClick, setEmailClick] = useState(false);
  const [phoneClick, setPhoneClick] = useState(false);
  const [email, setEmail] = useState("");

  const changeScreen = useStore((state) => state.changeScreen);
  const userName = useStore((state) => state.userName);

  return (
    <div className="w-[70vw] xl:mx-0 mx-auto xl:w-[35rem] min-[460px]:mt-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl w-[85%] max-[460px]:mb-5 mb-12 font-bold text-[#D18F5F]">
        Hello {userName}! How can I contact you?
      </h1>

      <div className="">
        <div className="flex sm:flex-row flex-col sm:items-center my-12">
          <div
            className={`bg-[#ffffff] max-[460px]:w-60 w-80 h-20 sm:h-32 ${
              emailClick ? "border border-[#F67B36]" : "border-none"
            }  rounded-xl`}
            onClick={() => setEmailClick((prev) => !prev)}
          >
            <div
              className={`${
                emailClick ? "opacity-100" : "hover:opacity-100 opacity-60"
              } flex items-center justify-center cursor-pointer transition h-full w-full`}
            >
              <EmailIcon fillColor={emailClick ? "#F67B36" : "#000000"} />
              <span
                className={`${
                  emailClick ? "text-[#F67B36]" : "text-black"
                } pl-3`}
              >
                I prefer emails.
              </span>
            </div>
          </div>

          {/* <div
            className={`bg-[#ffffff] mt-3 sm:ml-3 sm:mt-0 max-[460px]:w-60 w-80 h-20 sm:h-32 ${
              phoneClick ? "border border-[#F67B36]" : "border-none"
            } rounded-xl`}
            onClick={() => setPhoneClick((prev) => !prev)}
          >
            <div
              className={`${
                phoneClick ? "opacity-100" : "hover:opacity-100 opacity-60"
              } flex items-center justify-center cursor-pointer transition h-full w-full`}
            >
              <PhoneIcon fillColor={phoneClick ? "#F67B36" : "#000000"} />
              <span
                className={`${
                  phoneClick ? "text-[#F67B36]" : "text-black"
                } pl-3`}
              >
                I prefer phone calls.
              </span>
            </div>
          </div> */}
        </div>

        {/* This needs to be update in future. */}
        {emailClick && (
          <form
            onSubmit={() => changeScreen("chat")}
            className="bg-white rounded-full p-[0.6rem] flex justify-between items-center"
          >
            <input
              className="bg-transparent placeholder:text-[#0000004D] text-black px-5 mr-3 w-full text-lg font-medium border-none outline-none"
              placeholder="Enter your email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <button
              type="submit"
              className="bg-[#F67B36] flex items-center justify-center rounded-full p-3 w-10 h-10"
            >
              <Arrow />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
