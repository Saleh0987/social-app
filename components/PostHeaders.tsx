"use client";

import {EllipsisHorizontalIcon, TrashIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {db} from "@/firebase";
import {doc, deleteDoc} from "firebase/firestore";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

interface PostHeaderProps {
  postId: string;
  image: string;
  name: string;
  username: string;
}

export default function PostHeaders({
  postId,
  image,
  name,
  username,
}: PostHeaderProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        router.push("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-between items-center mb-1.5">
      <div className="flex space-x-3">
        <Image
          width={44}
          height={44}
          src={image ? image : "/assets/user.png"}
          alt="Profile image"
          className="w-11 h-11 rounded-full"
        />
        <div className="flex flex-col text-[15px]">
          <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px] sm:max-w-[160px]">
            {name}
          </span>
          <span className="text-[#707E89] whitespace-nowrap overflow-hidden text-ellipsis max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px] sm:max-w-[160px]">
            @{username}
          </span>
        </div>
      </div>
      {user?.username === username && (
        <TrashIcon className="w-5 h-5 cursor-pointer" onClick={handleDelete} />
      )}
    </div>
  );
}
