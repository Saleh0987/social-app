"use client";
import {db} from "@/firebase";
import {closeCommentModal, openLoginModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {
  ArrowPathIcon,
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

interface PostInputProps {
  insideModal?: boolean;
}

export default function PostInput({insideModal}: PostInputProps) {
  const [text, setText] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const isLoading = loading || commentLoading;
  const commentDetails = useSelector(
    (state: RootState) => state.modals.commentPostDetails
  );
  const dispatch = useDispatch();

  async function sendPost() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        text: text,
        name: user.name,
        username: user.username,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      });
      setText("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding document: ", error);
    }
  }

  async function sendComment() {
    setCommentLoading(true);
    try {
      const postRef = doc(db, "posts", commentDetails.id);
      await updateDoc(postRef, {
        comments: arrayUnion({
          name: user.name,
          username: user.username,
          text: text,
        }),
      });
      setText("");
      dispatch(closeCommentModal());
      setCommentLoading(false);
    } catch (error) {
      setCommentLoading(false);
      console.error("Error adding document: ", error);
    }
  }

  return (
    <div className="flex space-x-5 p-3 border-b border-gray-100">
      <Image
        src={insideModal ? "/assets/user.png" : "/assets/logo.png"}
        width={44}
        height={44}
        alt={insideModal ? "Profile image" : "logo"}
        className={`w-11 h-11 rounded-full z-10 bg-white`}
      />

      <div className="w-full">
        <textarea
          className="resize-none outline-none w-full min-h-[50px] text-lg"
          placeholder={insideModal ? "Send your reply" : "What's happening!?"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-between items-center pt-5 border-t border-gray-100">
          <div className="flex space-x-1.5 cursor-pointer">
            <PhotoIcon className="w-[22px] h-[22px] text-[#ee0e3a]" />
            <ChartBarIcon className="w-[22px] h-[22px] text-[#ee0e3a]" />
            <FaceSmileIcon className="w-[22px] h-[22px] text-[#ee0e3a]" />
            <CalendarIcon className="w-[22px] h-[22px] text-[#ee0e3a]" />
            <MapPinIcon className="w-[22px] h-[22px] text-[#ee0e3a]" />
          </div>

          <button
            disabled={!text}
            onClick={() => (insideModal ? sendComment() : sendPost())}
            className="bg-[#ee0e3a] text-white w-[80px] h-[36px] rounded-full text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : (
              <span className="text-sm font-medium text-white">
                {insideModal ? "Reply" : "Bumble"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
