"use client";
import React, {useEffect, useState} from "react";
import {Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {closeSignUpModal, openSignUpModal} from "@/redux/slices/modalSlice";
import {EyeIcon, EyeSlashIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {ArrowPathIcon} from "@heroicons/react/24/solid";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {auth} from "@/firebase";
import {signInUser} from "@/redux/slices/userSlice";

export default function SignUpModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const isOpen = useSelector(
    (state: RootState) => state.modals.signUpModalOpen
  );

  const dispatch: AppDispatch = useDispatch();

  async function handleSignUp() {
    setIsSignUpLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredentials.user, {
        displayName: name,
      });

      dispatch(
        signInUser({
          name: userCredentials.user.displayName,
          username: userCredentials.user.email!.split("@")[0],
          email: userCredentials.user.email,
          uid: userCredentials.user.uid,
        })
      );
    } finally {
      setIsSignUpLoading(false);
    }
  }

  async function handleGuestLogin() {
    setIsGuestLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        "guest123450000@gmail.com",
        "12345678"
      );
    } finally {
      setIsGuestLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) return;

      dispatch(
        signInUser({
          name: currentUser.displayName,
          username: currentUser.email!.split("@")[0],
          email: currentUser.email,
          uid: currentUser.uid,
        })
      );
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <button
        className="w-full h-[48px] md:w-[88px] md:h-[40px] text-md md:text-sm
        rounded-full bg-white font-bold"
        onClick={() => dispatch(openSignUpModal())}
      >
        Sign Up
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignUpModal())}
        className="flex justify-center items-center"
      >
        <div className="w-full h-full sm:w-[600px] sm:h-fit bg-white sm:rounded-xl outline-none">
          <XMarkIcon
            className="w-7 mt-5 ms-5 cursor-pointer"
            onClick={() => dispatch(closeSignUpModal())}
          />
          <div className="pt-10 pb-20 px-4 sm:px-20">
            <h1 className="text-3xl font-bold mb-10">Create your account</h1>
            <div className="w-full space-y-5 mb-10">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                className="w-full h-[54px] border border-gray-200 outline-none
                 pl-3 rounded-[4px] focus:border-[#ee0e3a] transition-all"
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="w-full h-[54px] border border-gray-200 outline-none
                 pl-3 rounded-[4px] focus:border-[#ee0e3a] transition-all"
              />
              <div
                className="w-full h-[54px] border border-gray-200 outline-none
                 rounded-[4px] focus-within:border-[#ee0e3a] transition-all flex items-center
                 overflow-hidden pr-3"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="w-full h-full ps-3 outline-none"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="w-7 h-7 text-gray-400 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="text-[#ee0e3a]" />
                  ) : (
                    <EyeIcon className="text-[#ee0e3a]" />
                  )}
                </div>
              </div>
            </div>

            <button
              className="bg-[#ee0e3a] text-white h-[48px] rounded-full shadow-md mb-5 w-full flex items-center justify-center"
              onClick={() => handleSignUp()}
              disabled={isSignUpLoading || isGuestLoading}
            >
              {isSignUpLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
                </div>
              ) : (
                <span className="text-sm font-medium text-white">Sign Up</span>
              )}
            </button>
            <span className="mb-5 text-sm text-center block">Or</span>
            <button
              className="bg-[#ee0e3a] text-white h-[48px] rounded-full shadow-md mb-5 w-full flex items-center justify-center"
              onClick={() => handleGuestLogin()}
              disabled={isSignUpLoading || isGuestLoading}
            >
              {isGuestLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
                </div>
              ) : (
                <span className="text-sm font-medium text-white">
                  Log In as Guest
                </span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
