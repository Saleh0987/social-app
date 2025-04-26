"use client";

import {
  closeLoginModal,
  closeLogoutModal,
  closeSignUpModal,
} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {Modal} from "@mui/material";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {signOut} from "firebase/auth";
import {auth} from "@/firebase";
import {signOutUser} from "@/redux/slices/userSlice";
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";

export default function LogoutModal() {
  const open = useSelector((state: RootState) => state.modals.logoutModalOpen);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    dispatch(closeSignUpModal());
    dispatch(closeLoginModal());
    dispatch(closeLogoutModal());

    if (pathname !== "/") {
      router.push("/");
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeLogoutModal())}
      className="flex items-center justify-center"
    >
      <div className="max-w-[400px] bg-white rounded-xl outline-none relative shadow-lg">
        <XMarkIcon
          className="w-7 mt-5 ms-5 cursor-pointer text-gray-500 hover:text-gray-700 transition"
          onClick={() => dispatch(closeLogoutModal())}
        />
        <div className="flex flex-col justify-center items-center p-10">
          <p className="mb-6 text-gray-800 font-medium text-center">
            Are you sure you want to log out?
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => dispatch(closeLogoutModal())}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
