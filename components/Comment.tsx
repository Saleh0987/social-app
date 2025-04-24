import {
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {PostHeader} from "./Post";

interface CommentProps {
  index: number;
  name: string;
  username: string;
  text: string;
  image: string;
  commentImage?: string;
}
export function Comment({
  index,
  name,
  username,
  text,
  image,
  commentImage,
}: CommentProps) {
  return (
    <div className="border-b border-gray-100 relative">
      <PostHeader
        key={index}
        name={name}
        username={username}
        text={text}
        image={image}
        commentImage={commentImage}
      />

      <div className="flex space-x-14 p-3 ms-16">
        <ChatBubbleOvalLeftEllipsisIcon className="w-[22px] h-[22px] cursor-not-allowed" />
        <HeartIcon className="w-[22px] h-[22px] cursor-not-allowed" />
      </div>
    </div>
  );
}
