"use client";

import {useEffect, useState} from "react";
import {closeLikesModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/firebase";

interface Like {
  id: string;
  name: string;
  username: string;
  image: string;
}

const fetchPost = async (id: string) => {
  const postRef = doc(db, "posts", id);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) {
    throw new Error("Post does not exist.");
  }
  return postSnap.data();
};

interface LikesModalProps {
  id: string;
}

export default function LikesModal({id}: LikesModalProps) {
  const open = useSelector((state: RootState) => state.modals.likesModalOpen);
  const dispatch = useDispatch();
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const likesDetails = useSelector(
    (state: RootState) => state.modals.likesPostDetails
  );

  useEffect(() => {
    const loadLikes = async () => {
      if (open && likesDetails.id) {
        setLoading(true);
        setError(null);
        try {
          const post = await fetchPost(likesDetails.id);
          setLikes(post?.likes || []);
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Something went wrong.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadLikes();
  }, [open, likesDetails.id]);

  return (
    <Modal
      open={open}
      onClose={() => dispatch(closeLikesModal())}
      className="flex items-center justify-center"
      aria-labelledby="likes-modal-title"
    >
      <div className="max-w-[400px] w-full bg-white rounded-2xl shadow-2xl relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Close likes modal"
          onClick={() => dispatch(closeLikesModal())}
        >
          <XMarkIcon className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-6">
          <h2
            id="likes-modal-title"
            className="text-2xl font-semibold text-center text-gray-800 mb-6"
          >
            Liked by
          </h2>

          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && likes.length === 0 && (
            <p className="text-center text-gray-400">No likes yet.</p>
          )}

          {!loading && !error && likes.length > 0 && (
            <ul
              className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin 
            scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
            >
              {likes.map((like) => (
                <li
                  key={like.id}
                  className="flex items-center space-x-4 border border-gray-100 p-1"
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={like.image || "/assets/user.png"}
                      alt={`${like.name || "User"}'s profile picture`}
                      width={48}
                      height={48}
                      className="rounded-full object-contain size-12"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {like.name || "Anonymous"}
                    </p>
                    <p className="text-xs font-medium text-gray-500 ps-2">
                      @{like.username || "Anonymous"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
