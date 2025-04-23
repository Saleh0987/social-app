"use client";
import {Comment} from "@/components/Comment";
import LogoutModal from "@/components/modals/LogoutModal";
import Sidebar from "@/components/Sidebar";
import SignUpPrompt from "@/components/SignUpPrompt";
import Widgets from "@/components/Widgets";
import {db} from "@/firebase";
import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {doc, getDoc} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const fetchPost = async (id: string) => {
  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);
  return postSnap.data();
};

interface pageProps {
  params: {
    id: string;
  };
}

interface Comment {
  name: string;
  username: string;
  text: string;
  image: string;
}

export default async function page({params}: pageProps) {
  const {id} = params;
  const post = await fetchPost(id);

  return (
    <>
      <div className="text-[#0f1419] min-h-screen max-w-[1400px] mx-auto flex justify-center">
        <Sidebar />
        <div className="flex-grow max-w-2xl border-x border-gray-100">
          <div
            className="py-4 px-3 text-lg sm:text-xl sticky top-0 z-50 
         bg-white/80 backdrop-blur-sm font-bold border-b border-gray-100 flex items-center"
          >
            <Link href="/">
              <ArrowLeftIcon className="w-5 h-5 mr-10" />
            </Link>
            Bumble
          </div>

          <div className="flex flex-col p-3 space-y-5 border-b border-gray-100">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex space-x-3">
                <Image
                  width={44}
                  height={44}
                  src={post?.image ? post?.image : "/assets/user.png"}
                  alt="Profile image"
                  className="w-11 h-11 rounded-full"
                />
                <div className="flex flex-col text-[15px]">
                  <span
                    className="font-bold whitespace-nowrap
                    overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px]
                    min-[500px]:max-w-[140px] sm:max-w-[160px]"
                  >
                    {post?.name}
                  </span>
                  <span
                    className="text-[#707E89] whitespace-nowrap
                    overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px]
                    min-[500px]:max-w-[140px] sm:max-w-[160px] "
                  >
                    @{post?.username}
                  </span>
                </div>
              </div>

              <EllipsisHorizontalIcon className="w-5 h-5" />
            </div>
            <span className="text-[15px]">{post?.text}</span>
          </div>

          <div className="border-b border-gray-100 p-3 text-[15px]">
            <span className="font-bold">{post?.likes.length}</span> Likes
          </div>

          <div className="border-b border-gray-100 p-3 text-[15px] flex justify-evenly">
            <ChatBubbleOvalLeftEllipsisIcon className="w-[22px] h-[22px] cursor-not-allowed" />
            <HeartIcon className="w-[22px] h-[22px] cursor-not-allowed" />
            <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed" />
            <ArrowUpTrayIcon className="w-[22px] h-[22px] cursor-not-allowed" />
          </div>
          {post?.comments.map((comment: Comment) => (
            <Comment
              key={comment.text}
              name={comment.name}
              username={comment.username}
              text={comment.text}
              image={comment.image}
            />
          ))}
        </div>
        <Widgets />
      </div>
      <SignUpPrompt />
      <LogoutModal />
    </>
  );
}
