"use client";

import {useState, useEffect} from "react";
import {Comment} from "@/components/Comment";
import LogoutModal from "@/components/modals/LogoutModal";
import Sidebar from "@/components/Sidebar";
import SignUpPrompt from "@/components/SignUpPrompt";
import Widgets from "@/components/Widgets";
import PostHeaders from "@/components/PostHeaders";
import PostActions from "@/components/PostActions";
import PostInput from "@/components/PostInput";
import {db} from "@/firebase";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {doc, onSnapshot, getDoc, updateDoc} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import {getAuth} from "firebase/auth";
import CommentModal from "@/components/modals/CommentModal";
import ProfileModal from "@/components/modals/ProfileModal";
import LikesModal from "@/components/modals/LikesModal";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import toast from "react-hot-toast";

interface Comment {
  name: string;
  username: string;
  text: string;
  image: string;
  commentImage?: string;
  id: string;
}

interface pageProps {
  params: {
    id: string;
  };
}

export default function Page({params}: pageProps) {
  const {id} = params;
  const [post, setPost] = useState<any>(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid || null;

  useEffect(() => {
    const postRef = doc(db, "posts", id);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      if (doc.exists()) {
        setPost({id: doc.id, ...doc.data()});
      } else {
        console.log("No such post!");
      }
    });

    return () => unsubscribe();
  }, [id]);

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

          {!post ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="flex flex-col p-3 space-y-5 border-b border-gray-100">
                <PostHeaders
                  postId={id}
                  image={post?.image}
                  name={post?.name}
                  username={post?.username}
                  timestamp={post?.timestamp}
                />

                <span className="text-[15px]">{post?.text}</span>

                {post?.postImage && (
                  <Image
                    src={post?.postImage}
                    width={200}
                    height={200}
                    alt="Post image"
                    className={`rounded-lg w-64 h-64 object-cover`}
                  />
                )}
              </div>

              <PostActions
                postId={id}
                likes={post?.likes || []}
                userId={userId}
                name={post?.name || ""}
                username={post?.username || ""}
                text={post?.text || ""}
                image={post?.image || "/assets/user.png"}
                postImage={post?.postImage}
                comments={post?.comments || []}
              />

              {post?.comments.length > 0 ? (
                post?.comments.map((comment: Comment) => (
                  <Comment
                    id={comment.id}
                    key={comment.id}
                    name={comment.name}
                    username={comment.username}
                    text={comment.text}
                    image={comment.image}
                    commentImage={comment.commentImage}
                    postId={id}
                    postOwnerUsername={post?.username}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 p-3">
                  No comments yet.
                </p>
              )}

              <div className="border-t border-gray-200 p-4">
                <PostInput insideModal={true} postId={id} />
              </div>
            </>
          )}
        </div>
        <Widgets />
      </div>
      <SignUpPrompt />
      <LogoutModal />
      <CommentModal />
      <ProfileModal />
      <LikesModal id={id} />
    </>
  );
}
