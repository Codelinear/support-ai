import React, { useEffect, useRef, useState } from "react";
import EmailIcon from "@/components/icons/email";
import Arrow from "@/components/icons/arrow";
import PhoneIcon from "@/components/icons/phone";
import { useStore } from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryPhoneCodes } from "@/constants/array";
import OrangeButton from "./icons/orange-button";

const Contact = () => {
  const [emailClick, setEmailClick] = useState(false);
  const [phoneClick, setPhoneClick] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const changeScreen = useStore((state) => state.changeScreen);
  const userName = useStore((state) => state.userName);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailClick) {
      emailInputRef.current?.focus();
      setEmail("");
    }

    if (phoneClick) {
      phoneInputRef.current?.focus();
      setPhone("");
    }
  }, [emailClick, phoneClick]);

  return (
    <div className="w-[85vw] min-[400px]:w-[70vw] xl:mx-0 mx-auto xl:w-[35rem] sm:mt-10">
      <h1 className="text-3xl sm:text-4xl md:text-[3.5rem] md:leading-[1] w-[90%] sm:text-start text-center sm:my-[10vh] text-[#D18F5F]">
        Hello {userName}! How can I contact you?
      </h1>

      <div className="">
        <div className="flex gap-x-3 sm:flex-row flex-col sm:items-center my-10">
          <div
            className={`bg-[#ffffff] transition duration-300 w-full sm:w-80 h-32 ${
              emailClick ? "border border-[#F67B36]" : "border-none"
            }  rounded-xl`}
            onClick={() => {
              setEmailClick((prev) => !prev);
              setPhoneClick(false);
            }}
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

          <div
            className={`bg-[#ffffff] mt-3 sm:mt-0 w-full sm:w-80 h-32 ${
              phoneClick ? "border border-[#F67B36]" : "border-none"
            } rounded-xl`}
            onClick={() => {
              setPhoneClick((prev) => !prev);
              setEmailClick(false);
            }}
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
          </div>
        </div>

        {emailClick && (
          <form
            onSubmit={() => {
              changeScreen("chat");
            }}
            className="bg-white rounded-full w-full sm:w-[82%] p-[0.7rem] flex justify-between items-center"
          >
            <input
              ref={emailInputRef}
              className="bg-transparent placeholder:text-[#0000004D] text-black px-5 mr-3 w-full text-lg font-medium border-none outline-none"
              placeholder="Enter your email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <button type="submit">
              <OrangeButton />
            </button>
          </form>
        )}

        {phoneClick && (
          <form
            onSubmit={() => changeScreen("chat")}
            className="bg-white rounded-full w-full sm:w-[82%] p-[0.7rem] flex justify-between items-center"
          >
            <Select defaultValue={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="border-none gap-x-1 w-20 border">
                <SelectValue placeholder="+91" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countryPhoneCodes.map((code) => (
                    <SelectItem
                      key={code}
                      value={code}
                      className="cursor-pointer"
                    >
                      {code}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              ref={phoneInputRef}
              className="bg-transparent placeholder:text-[#0000004D] text-black pr-5 mr-3 w-full text-lg font-medium border-none outline-none"
              placeholder="Enter your phone number"
              autoComplete="off"
              maxLength={10}
              minLength={10}
              value={phone}
              onChange={(e) => {
                if (/^\d+$/.test(e.target.value) || e.target.value === "") {
                  setPhone(e.target.value);
                }
              }}
              type="tel"
              required
            />
            <button type="submit">
              <OrangeButton />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
