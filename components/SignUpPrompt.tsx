"use client";
import React from "react";
import SignUpModal from "./modals/SignUpModal";
import LoginModal from "./modals/LoginModal";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

export default function SignUpPrompt() {
  const name = useSelector((state: RootState) => state.user.name);
  return (
    !name && (
      <div
        className="fixed w-full h-[80px] bg-[#ee0e3a] bottom-0 flex justify-center 
    lg:justify-between items-center md:space-x-5 lg:px-20 xl:px-40 2xl:px80 z-50"
      >
        <div className="hidden md:flex flex-col text-white">
          <span className="text-xl font-bold">
            Don't miss out on joining us!
          </span>
          <span>People on Busy Bee always the first to know</span>
        </div>

        <div className="flex space-x-2 w-full md:w-fit p-3">
          <LoginModal />
          <SignUpModal />
        </div>
      </div>
    )
  );
}
