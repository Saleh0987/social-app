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
import {Comment} from "../../app/[id]/page";

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

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeCommentModal())}
      className="flex items-center justify-center"
    >
      <div className="w-full sm:w-[600px] h-[90vh] sm:h-[80vh] bg-white sm:rounded-xl outline-none relative flex flex-col">
        <XMarkIcon
          className="w-7 mt-5 ms-5 cursor-pointer absolute top-0 left-0 z-10"
          onClick={() => dispatch(closeCommentModal())}
        />
        <div className="flex flex-col h-full pt-14 pb-5 px-0 sm:px-5 overflow-hidden">
          <div className="flex-shrink-0">
            <PostHeader
              name={commentDetails.name}
              username={commentDetails.username}
              text={commentDetails.text}
              replayTo={commentDetails.username}
              image={commentDetails.image}
            />
            <div className="absolute w-0.5 h-36 bg-gray-300 left-[33px] sm:left-[53px] top-20 z-0"></div>
          </div>

          <div ref={commentsRef} className="flex-grow mt-4 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.text}
                  name={comment.name}
                  username={comment.username}
                  text={comment.text}
                  image={comment.image}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 p-3">No comments yet.</p>
            )}
          </div>

          <div className="flex-shrink-0 mt-4 border-t border-gray-100 pt-4">
            <PostInput insideModal={true} onCommentAdded={handleNewComment} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
