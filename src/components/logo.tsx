import React from "react";
import Redirect from "@/components/icons/redirect";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <header
      id="logo"
      className="absolute z-[1] top-[3%] left-[5%] sm:left-[2%]"
    >
      <h2 className="font-medium text-3xl pointer-events-none">
        Support.AI
      </h2>
      <div
        className="flex hover:underline transition text-sm items-center cursor-pointer justify-end ml-auto mt-2"
        onClick={() => router.push("https://codelinear.com/")}
      >
        <h4 className="mr-1">by Codelinear</h4>
        <Redirect />
      </div>
    </header>
  );
};

export default Logo;
