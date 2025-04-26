"use client";
import React, {useEffect, useState} from "react";
import PostInput from "./PostInput";
import Post from "./Post";
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {db} from "@/firebase";
import {useDispatch, useSelector} from "react-redux";
import {closeLoadingScreen} from "@/redux/slices/loadingSlice";
import {RootState} from "@/redux/store";

export default function PostFeed() {
  const [posts, setPosts] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData>[]
  >([]);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const snapshotDocs = snapshot.docs;

      setPosts(snapshotDocs);

      dispatch(closeLoadingScreen());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex-grow max-w-2xl border-x border-gray-100">
      <div
        className={`
    py-4 px-4 sm:px-6 text-lg sm:text-xl sticky top-0 z-10 
    flex items-center space-x-2
    bg-white/90 backdrop-blur-lg border-b border-gray-200/50 
    font-semibold text-gray-900 
    shadow-sm transition-all duration-300 ease-in-out
  `}
      >
        {/* Home Title */}
        <span
          className={`
      tracking-tight hover:text-[#ee0e3a] transition-colors duration-200 cursor-pointer
    `}
        >
          Home
        </span>

        {user.name && (
          <span
            className={`
        text-sm sm:text-base text-gray-600 
        font-medium bg-gray-100/80 rounded-full 
        px-3 py-1.5 
        hover:bg-gray-200/80 transition-all duration-200
      `}
          >
            Welcome, {user.name}
          </span>
        )}
      </div>
      <PostInput />

      {posts.map((post) => (
        <Post key={post.id} data={post.data()} id={post.id} />
      ))}
    </div>
  );
}
