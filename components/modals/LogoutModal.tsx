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

export default function LogoutModal() {
  const open = useSelector((state: RootState) => state.modals.logoutModalOpen);
  const dispatch = useDispatch();
  async function handleSignOut() {
    await signOut(auth);
    dispatch(signOutUser());
    dispatch(closeSignUpModal());
    dispatch(closeLoginModal());
    dispatch(closeLogoutModal());
  }

  return (
    <>
      <Modal
        open={open}
        onClose={() => dispatch(closeLogoutModal())}
        className="flex items-center justify-center"
      >
        <div className="max-w-[400px] lg:h-fit bg-white rounded-xl outline-none relative">
          <XMarkIcon
            className="w-7 mt-5 ms-5 cursor-pointer"
            onClick={() => dispatch(closeLogoutModal())}
          />
          <div className="flex flex-col justify-center items-center p-10">
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="mt-auto flex justify-end space-x-4">
              <button
                onClick={() => dispatch(closeLogoutModal())}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
