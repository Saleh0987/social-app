import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {PostHeader} from "./Post";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/firebase";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import toast from "react-hot-toast";

interface CommentProps {
  id: string;
  name: string;
  username: string;
  text: string;
  image: string;
  commentImage?: string;
  postId?: string;
  postOwnerUsername: string;
  onDelete?: (id: string) => void;
}

export function Comment({
  id,
  name,
  username,
  text,
  image,
  commentImage,
  postId,
  postOwnerUsername,
  onDelete,
}: CommentProps) {
  const user = useSelector((state: RootState) => state.user);

  async function handleDeleteComment() {
    if (!postId) return;

    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        const updatedComments = postData.comments.filter(
          (comment: any) => comment.id !== id
        );

        await updateDoc(postRef, {
          comments: updatedComments,
        });

        toast.success("Comment deleted successfully!");

        if (onDelete) {
          onDelete(id);
        }
      }
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  }

  const canDelete =
    user.username === username || user.username === postOwnerUsername;

  return (
    <div className="border-b border-gray-100 relative">
      <PostHeader
        key={id}
        name={name}
        username={username}
        text={text}
        image={image}
        commentImage={commentImage}
      />

      <div className="flex space-x-14 p-3 ms-16">
        <ChatBubbleOvalLeftEllipsisIcon className="w-[22px] h-[22px] cursor-not-allowed" />
        <HeartIcon className="w-[22px] h-[22px] cursor-not-allowed" />
        {canDelete && (
          <TrashIcon
            onClick={handleDeleteComment}
            className="w-[22px] h-[22px] cursor-pointer text-red-500 hover:scale-110 transition"
          />
        )}
      </div>
    </div>
  );
}
