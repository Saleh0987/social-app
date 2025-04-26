"use client";
import React, {useEffect, useState} from "react";
import {Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {closeSignUpModal, openSignUpModal} from "@/redux/slices/modalSlice";
import {EyeIcon, EyeSlashIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {ArrowPathIcon, PhotoIcon} from "@heroicons/react/24/solid";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {auth, storage} from "@/firebase";
import {signInUser} from "@/redux/slices/userSlice";
import Cookies from "js-cookie";

export default function SignUpModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
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
      if (!file) {
        alert("Please upload an image.");
        setIsSignUpLoading(false);
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const storageRef = ref(storage, `images/${Date.now() + name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const downloadUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      await updateProfile(userCredentials.user, {
        displayName: name,
        photoURL: downloadUrl,
      });

      dispatch(
        signInUser({
          name: userCredentials.user.displayName,
          username: userCredentials.user.email!.split("@")[0],
          email: userCredentials.user.email,
          uid: userCredentials.user.uid,
          photoURL: downloadUrl,
        })
      );
    } catch (error: any) {
      console.error("Sign up error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsSignUpLoading(false);
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
              photoURL: userCredentials.user.photoURL || "",
            })
          );
          return;
        } catch (error: any) {
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
          photoURL: "",
        })
      );
    } catch (error: any) {
      console.error("Guest login error:", error);
      alert("Guest login failed");
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
          photoURL: currentUser.photoURL || "",
        })
      );
    });

    return unsubscribe;
  }, [dispatch]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <>
      <button
        className="w-full h-[48px] md:w-[88px] md:h-[40px] text-md md:text-sm rounded-full bg-white font-bold"
        onClick={() => dispatch(openSignUpModal())}
      >
        Sign Up
      </button>

      <Modal
        open={isOpen}
        onClose={() => dispatch(closeSignUpModal())}
        className="flex justify-center items-center p-2"
      >
        <div className="w-full h-fit sm:w-[600px] bg-white rounded-xl outline-none">
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
                className="w-full h-[54px] border border-gray-200 outline-none pl-3 rounded-[4px] focus:border-[#ee0e3a] transition-all"
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email"
                className="w-full h-[54px] border border-gray-200 outline-none pl-3 rounded-[4px] focus:border-[#ee0e3a] transition-all"
              />
              <div className="w-full h-[54px] border border-gray-200 outline-none rounded-[4px] focus-within:border-[#ee0e3a] transition-all flex items-center overflow-hidden pr-3">
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
              <div className="w-full h-[54px] border border-gray-200 rounded-[4px] focus-within:border-[#ee0e3a] transition-all flex items-center px-3">
                <PhotoIcon className="w-6 h-6 text-[#ee0e3a] mr-2" />
                <label
                  htmlFor="file-upload"
                  className="flex-grow cursor-pointer text-gray-500 truncate"
                >
                  {fileName || "Upload profile image"}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {file && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setFileName("");
                    }}
                    className="text-[#ee0e3a] text-sm"
                  >
                    Clear
                  </button>
                )}
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
