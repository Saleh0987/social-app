"use client";

import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import {db} from "@/firebase";
import {doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
import {useSelector, useDispatch} from "react-redux";
import {useState} from "react";
import {
  openCommentModal,
  openLoginModal,
  setCommentPostDetails,
} from "@/redux/slices/modalSlice";

interface PostActionsProps {
  postId: string;
  likes: string[];
  userId: string | null;
  name: string;
  username: string;
  text: string;
  image: string;
  postImage?: string;
  comments: any[]; // Added to show comment count
}

export default function PostActions({
  postId,
  likes,
  userId,
  name,
  username,
  text,
  image,
  postImage,
  comments,
}: PostActionsProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(
    userId ? likes.includes(userId) : false
  );

  const likePost = async () => {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    const postRef = doc(db, "posts", postId);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId!),
        });
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId!),
        });
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleCommentClick = () => {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    dispatch(
      setCommentPostDetails({
        name,
        username,
        id: postId,
        text,
        image,
        postImage,
      })
    );
    dispatch(openCommentModal());
  };

  return (
    <>
      <div className="border-b border-gray-100 p-3 text-[15px]">
        <span className="font-bold">{likeCount}</span> Likes
      </div>
      <div className="border-b border-gray-100 p-3 text-[15px] flex justify-evenly">
        <div className="relative">
          <ChatBubbleOvalLeftEllipsisIcon
            className="w-[22px] h-[22px] cursor-pointer hover:text-[#ee0e3a] transition-all"
            onClick={handleCommentClick}
            aria-label="Comment on post"
          />
          {comments.length > 0 && (
            <span className="absolute text-xs top-1 -right-3">
              {comments.length}
            </span>
          )}
        </div>
        <div className="relative">
          {isLiked ? (
            <HeartSolidIcon
              className="w-[22px] h-[22px] text-red-500 cursor-pointer"
              onClick={likePost}
              aria-label="Unlike post"
            />
          ) : (
            <HeartOutlineIcon
              className="w-[22px] h-[22px] cursor-pointer hover:text-red-500 transition-all"
              onClick={likePost}
              aria-label="Like post"
            />
          )}
          {likeCount > 0 && (
            <span className="absolute text-xs top-1 -right-3">{likeCount}</span>
          )}
        </div>
        <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed" />
        <ArrowUpTrayIcon className="w-[22px] h-[22px] cursor-not-allowed" />
      </div>
    </>
  );
}
