"use client";
import React, {useState} from "react";
import {Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {closeLoginModal, openLoginModal} from "@/redux/slices/modalSlice";
import {EyeIcon, EyeSlashIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {ArrowPathIcon} from "@heroicons/react/24/solid";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {auth} from "@/firebase";
import {signInUser} from "@/redux/slices/userSlice";
import Cookies from "js-cookie";

export default function LoginModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const isOpen = useSelector((state: RootState) => state.modals.loginModalOpen);

  const dispatch: AppDispatch = useDispatch();

  async function handleLogin() {
    setIsLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setIsLoginLoading(false);
    }
  }

  async function handleGuestLogin() {
    setIsGuestLoading(true);
    try {
      const guestEmail = Cookies.get("guestEmail");
      const guestPassword = Cookies.get("guestPassword");

      if (guestEmail && guestPassword) {
        try {
          const userCredentials = await signInWithEmailAndPassword(
            auth,
            guestEmail,
            guestPassword
          );

          dispatch(
            signInUser({
              name: userCredentials.user.displayName,
              username: userCredentials.user.email!.split("@")[0],
              email: userCredentials.user.email,
              uid: userCredentials.user.uid,
            })
          );
          return;
        } catch (error) {
          console.error(
            "Failed to sign in with stored guest credentials:",
            error
          );
        }
      }

      const randomNum = Math.floor(1000 + Math.random() * 99000);
      const newGuestEmail = `guest_${randomNum}@example.com`;
      const newGuestPassword = "Guest12345678";

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        newGuestEmail,
        newGuestPassword
      );

      await updateProfile(userCredentials.user, {
        displayName: `Guest`,
      });

      Cookies.set("guestEmail", newGuestEmail, {expires: 30});
      Cookies.set("guestPassword", newGuestPassword, {expires: 30});

      dispatch(
        signInUser({
          name: userCredentials.user.displayName,
          username: userCredentials.user.email!.split("@")[0],
          email: userCredentials.user.email,
          uid: userCredentials.user.uid,
        })
      );
    } catch (error) {
      console.error("Guest login error:", error);
    } finally {
      setIsGuestLoading(false);
    }
  }

  return (
    <>
      <button
        className="w-full h-[48px] md:w-[88px] md:h-[40px] text-md md:text-sm border-2 border-gray-100 
        rounded-full text-white font-bold hover:bg-white/25 transition-all"
        onClick={() => dispatch(openLoginModal())}
      >
        Login
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeLoginModal())}
        className="flex justify-center items-center p-2"
      >
        <div className="w-full h-fit sm:w-[600px]  bg-white rounded-xl outline-none">
          <XMarkIcon
            className="w-7 mt-5 ms-5 cursor-pointer"
            onClick={() => dispatch(closeLoginModal())}
          />
          <div className="pt-10 pb-20 px-4 sm:px-20">
            <h1 className="text-3xl font-bold mb-10">Log in to Blogo</h1>
            <div className="w-full space-y-5 mb-10">
              <input
                autoComplete="off"
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
                  autoComplete="off"
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
              onClick={() => handleLogin()}
              disabled={isLoginLoading || isGuestLoading}
            >
              {isLoginLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
                </div>
              ) : (
                <span className="text-sm font-medium text-white">Login</span>
              )}
            </button>
            <span className="mb-5 text-sm text-center block">Or</span>
            <button
              className="bg-[#ee0e3a] text-white h-[48px] rounded-full shadow-md mb-5 w-full flex items-center justify-center"
              onClick={() => handleGuestLogin()}
              disabled={isLoginLoading || isGuestLoading}
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
