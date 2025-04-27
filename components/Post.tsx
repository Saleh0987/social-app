"use client";
import {db} from "@/firebase";
import {
  openCommentModal,
  openLoginModal,
  setCommentPostDetails,
} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import {HeartIcon as HeartSolidIcon} from "@heroicons/react/24/solid";
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, {useState, useEffect, useRef} from "react";
import Moment from "react-moment";
import {useDispatch, useSelector} from "react-redux";
import {FaFacebook, FaTwitter, FaWhatsapp} from "react-icons/fa";
import toast from "react-hot-toast";

interface PostProps {
  data: DocumentData;
  id: string;
}

export default function Post({data, id}: PostProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function likePost() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }

    const postRef = doc(db, "posts", id);
    const newLike = {
      id: user.uid,
      name: user.name,
      username: user.username,
      image: user.photoURL || "",
    };

    const isLiked = data.likes.some((like: any) => like.id === newLike.id);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(newLike),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(newLike),
      });
    }
  }

  const postUrl = `https://blogo-social-app-new.vercel.app/${id}`;

  const shareText = `${data.text} by @${data.username} - Check it out on Bumble!`;

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareText} ${postUrl}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setShowShareMenu(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
    });
  };

  return (
    <div className="border-b border-gray-100 shadow-sm">
      <Link href={"/" + id}>
        <PostHeader
          username={data.username}
          name={data.name}
          timestamp={data.timestamp}
          text={data.text}
          image={data.image}
          postImage={data.postImage}
        />
      </Link>

      <div className="ml-16 p-3 flex space-x-14">
        <div className="relative">
          <ChatBubbleOvalLeftEllipsisIcon
            className="w-[22px] h-[22px] cursor-pointer 
          hover:text-[#ee0e3a] transition-all"
            onClick={() => {
              if (!user.username) {
                dispatch(openLoginModal());
                return;
              }
              dispatch(
                setCommentPostDetails({
                  name: data.name,
                  username: data.username,
                  id: id,
                  text: data.text,
                  image: data.image,
                  postImage: data.postImage,
                })
              );
              dispatch(openCommentModal());
            }}
          />
          {data.comments.length > 0 && (
            <span className="absolute text-xs top-1 -right-3">
              {data.comments.length}
            </span>
          )}
        </div>
        <div className="relative">
          {data.likes.some((like: any) => like.id === user.uid) ? (
            <HeartSolidIcon
              className="w-[22px] h-[22px] cursor-pointer 
      text-pink-600 transition-all"
              onClick={() => likePost()}
            />
          ) : (
            <HeartIcon
              className="w-[22px] h-[22px] cursor-pointer 
      hover:text-pink-500 transition-all"
              onClick={() => likePost()}
            />
          )}
          {data.likes.length > 0 && (
            <span className="absolute text-xs top-1 -right-3">
              {data.likes.length}
            </span>
          )}
        </div>
        <div className="relative">
          <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed" />
        </div>
        <div className="relative">
          <ArrowUpTrayIcon
            className="w-[22px] h-[22px] cursor-pointer hover:text-[#ee0e3a] transition-all"
            onClick={() => setShowShareMenu(!showShareMenu)}
          />
          {showShareMenu && (
            <div
              ref={shareMenuRef}
              className="absolute z-10 mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 w-56"
            >
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={shareToFacebook}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span>Facebook</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={shareToTwitter}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <FaTwitter className="w-5 h-5 text-blue-400" />
                    <span>Twitter</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={shareToWhatsApp}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <FaWhatsapp className="w-5 h-5 text-green-500" />
                    <span>WhatsApp</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={copyLink}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <ClipboardIcon className="w-5 h-5 text-gray-600" />
                    <span>Copy Link</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface PostHeaderProps {
  username: string;
  name: string;
  timestamp?: Timestamp;
  text: string;
  replayTo?: string;
  image?: string;
  postImage?: string;
  insideModal?: boolean;
  commentImage?: string;
}

export function PostHeader({
  username,
  name,
  timestamp,
  text,
  replayTo,
  image,
  postImage,
  commentImage,
  insideModal,
}: PostHeaderProps) {
  const isArabic = (text: string) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };
  const textIsArabic = isArabic(text);
  const formatTime = (timeString: string) => {
    return timeString
      .replace("hours", "h")
      .replace("hour", "h")
      .replace("minutes", "m")
      .replace("minute", "m");
  };

  return (
    <div className="flex p-3 space-x-5">
      <Image
        src={image ? image : "/assets/user.png"}
        width={36}
        height={36}
        alt="logo"
        className="w-10 h-10 rounded-full z-10 bg-white"
      />

      <div className={`text-[15px] flex flex-col space-y-1.5 w-full `}>
        <div className="flex justify-between items-stretch text-[#707E89]">
          <div className="flex items-center space-x-1.5">
            <span
              className="font-bold text-[#0F1419] inline-block whitespace-nowrap
              overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px]
              min-[500px]:max-w-[140px] sm:max-w-[160px]"
            >
              {name}
            </span>

            <span
              className="inline-block whitespace-nowrap text-xs font-bold
              overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px]
              min-[500px]:max-w-[140px] sm:max-w-[160px]"
            >
              @{username}
            </span>
          </div>
          <div>
            {timestamp && (
              <Moment fromNow className="text-xs" filter={formatTime}>
                {timestamp.toDate()}
              </Moment>
            )}
          </div>
        </div>

        <span className="p-3" dir={textIsArabic ? "rtl" : "ltr"}>
          {text}
        </span>

        {postImage && (
          <Image
            src={postImage}
            width={200}
            height={200}
            alt="Post image"
            className={`rounded-lg ${
              insideModal ? "w-32 h-32" : "w-64 h-64"
            } object-cover`}
          />
        )}

        {commentImage && (
          <Image
            src={commentImage}
            width={200}
            height={200}
            alt="Post image"
            className={`rounded-lg ${
              insideModal ? "w-32 h-32" : "w-64 h-64"
            } object-cover`}
          />
        )}
        {replayTo && (
          <span className="text-[15px] text-[#707E89] text-right pb-2  border-b border-gray-100">
            Replaying to <span className="text-[#ee0e3a]">@{replayTo}</span>
          </span>
        )}
      </div>
    </div>
  );
}
