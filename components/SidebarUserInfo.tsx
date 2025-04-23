"use client";
import Image from "next/image";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";

export default function SidebarUserInfo() {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const defaultImage = "/assets/user.png";
  const profileImage = user.photoURL
    ? user.photoURL
    : defaultImage || defaultImage;

  return (
    <>
      {user?.name && (
        <div
          className="flex items-center justify-start lg:justify-center bg-gray-500/20 space-x-2 w-fit xl:w-[240px]
          hover:bg-gray-500/10 xl:p-3 xl:pe-6 rounded-full cursor-pointer transition-all duration-200"
        >
          <Image
            src={profileImage}
            width={36}
            height={36}
            alt="Profile Image"
            className="w-9 h-9 rounded-full border border-black p-0.5"
          />

          <div className="hidden xl:flex flex-col text-sm max-w-40">
            <span className="whitespace-nowrap text-ellipsis overflow-hidden font-bold">
              {user.name}
            </span>
            <span className="whitespace-nowrap text-ellipsis overflow-hidden text-gray-500 text-xs">
              @{user.username}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
