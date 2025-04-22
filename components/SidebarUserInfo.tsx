"use client";
import Image from "next/image";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "firebase/auth";
import {auth} from "@/firebase";
import {signOutUser} from "@/redux/slices/userSlice";
import {AppDispatch, RootState} from "@/redux/store";
import {closeLoginModal, closeSignUpModal} from "@/redux/slices/modalSlice";

export default function SidebarUserInfo() {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    dispatch(closeSignUpModal());
    dispatch(closeLoginModal());
  }
  return (
    <div
      className="absolute bottom-3 flex items-center justify-start space-x-2 w-fit xl:w-[240px]
     hover:bg-gray-500/10 xl:p-3 xl:pe-6 rounded-full cursor-pointer transition-all duration-200"
      onClick={() => handleSignOut()}
    >
      <Image
        src={"/assets/user.png"}
        width={36}
        height={36}
        alt="Profile Image"
        className="w-9 h-9 rounded-full"
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
  );
}
