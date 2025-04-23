"use client";
import {db} from "@/firebase";
import {closeCommentModal, openLoginModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {
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
  const commentDetails = useSelector(
    (state: RootState) => state.modals.commentPostDetails
  );
  const dispatch = useDispatch();

  async function sendPost() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }
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
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async function sendComment() {
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
    } catch (error) {
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
            <PhotoIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
            <ChartBarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
            <FaceSmileIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
            <CalendarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
            <MapPinIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
          </div>

          <button
            disabled={!text}
            onClick={() => (insideModal ? sendComment() : sendPost())}
            className="bg-[#F4AF01] text-white w-[80px] h-[36px] rounded-full 
            text-sm cursor-pointer 
            disabled:opacity-50"
          >
            Bumble
          </button>
        </div>
      </div>
    </div>
  );
}
