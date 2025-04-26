"use client";
import {closeCommentModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {Modal} from "@mui/material";
import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {PostHeader} from "../Post";
import PostInput from "../PostInput";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/firebase";
import {Comment} from "../Comment";

const fetchPost = async (id: string) => {
  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);
  return postSnap.data();
};

export default function CommentModal() {
  const open = useSelector((state: RootState) => state.modals.commentModalOpen);
  const commentDetails = useSelector(
    (state: RootState) => state.modals.commentPostDetails
  );
  const dispatch = useDispatch();
  const [comments, setComments] = useState<any[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && commentDetails.id) {
      fetchPost(commentDetails.id).then((post) => {
        setComments(post?.comments || []);
      });
    }
  }, [open, commentDetails.id]);

  const handleNewComment = (newComment: any) => {
    setComments((prevComments) => [...prevComments, newComment]);
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeCommentModal())}
      className="flex items-center justify-center p-2"
    >
      <div className="w-full sm:w-[600px] h-[90vh] bg-white rounded-xl shadow-lg outline-none relative flex flex-col overflow-hidden">
        {/* Close button */}
        <XMarkIcon
          className="w-7 h-7 text-gray-600 hover:text-gray-800 cursor-pointer absolute top-4 left-4"
          onClick={() => dispatch(closeCommentModal())}
        />

        {/* Modal content */}
        <div className="flex flex-col h-full pt-16 pb-4">
          {/* Scrollable Area (PostHeader + Comments together) */}
          <div
            ref={commentsRef}
            className="flex-grow overflow-y-auto px-4 space-y-6 pb-4"
          >
            {/* Post Section */}
            <div className="border-b border-gray-200 pb-4">
              <PostHeader
                name={commentDetails.name}
                username={commentDetails.username}
                text={commentDetails.text}
                replayTo={commentDetails.username}
                image={commentDetails.image}
                postImage={commentDetails.postImage}
                commentImage={commentDetails.commentImage}
                insideModal={true}
              />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    postId={commentDetails.id}
                    postOwnerUsername={commentDetails.username}
                    id={comment.id}
                    key={comment.id}
                    name={comment.name}
                    username={comment.username}
                    text={comment.text}
                    image={comment.image}
                    commentImage={comment.commentImage}
                    onDelete={handleDeleteComment}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 mt-10">
                  No comments yet.
                </p>
              )}
            </div>
          </div>

          {/* New Comment Input */}
          <div className="border-t border-gray-200 p-4">
            <PostInput insideModal={true} onCommentAdded={handleNewComment} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
