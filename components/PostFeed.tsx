import React from "react";
import PostInput from "./PostInput";
import Post from "./Post";

export default function PostFeed() {
  return (
    <div className="flex-grow max-w-2xl border-x border-gray-100">
      <div
        className="py-4 px-3 text-lg sm:text-xl sticky top-0 z-50 
    bg-white/80 backdrop-blur-sm font-bold border-b border-gray-100"
      >
        Home
        <PostInput />
      </div>
      <Post />
    </div>
  );
}
