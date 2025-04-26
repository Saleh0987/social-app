"use client";
import {db} from "@/firebase";
import {closeCommentModal, openLoginModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {
  ArrowPathIcon,
  CalendarIcon,
  ChartBarIcon,
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import Image from "next/image";
import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {storage} from "@/firebase";

const emojis = [
  "😊",
  "😂",
  "😍",
  "😎",
  "🥳",
  "😢",
  "😡",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🌟",
  "🚀",
  "🎉",
  "🍎",
  "🍕",
  "☕",
  "🌈",
  "⚽",
  "🎸",
];

interface PostInputProps {
  insideModal?: boolean;
  onCommentAdded?: (comment: any) => void;
}

export default function PostInput({
  insideModal,
  onCommentAdded,
}: PostInputProps) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const isLoading = loading || commentLoading;
  const commentDetails = useSelector(
    (state: RootState) => state.modals.commentPostDetails
  );
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Trigger file input click when PhotoIcon is clicked
  const handlePhotoIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
    setShowDatePicker(false);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Toggle date picker
  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
    setShowEmojiPicker(false); // Close emoji picker if open
  };

  // Handle date selection
  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    setText((prev) => prev + (prev ? " " : "") + formattedDate);
    setShowDatePicker(false);
  };

  async function sendPost() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        text: text,
        name: user.name,
        username: user.username,
        image: user.photoURL || "",
        postImage: imageUrl || "",
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
      });
      setText("");
      setImageFile(null);
      setImagePreview(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error adding document: ", error);
    }
  }

  async function sendComment() {
    if (!user.username) {
      dispatch(openLoginModal());
      return;
    }
    setCommentLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const imageRef = ref(
          storage,
          `comments/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const postRef = doc(db, "posts", commentDetails.id);
      const newComment = {
        name: user.name,
        username: user.username,
        text: text,
        image: user.photoURL || "",
        commentImage: imageUrl || "",
      };
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });
      setText("");
      setImageFile(null);
      setImagePreview(null);
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
      setCommentLoading(false);
    } catch (error) {
      setCommentLoading(false);
      console.error("Error adding document: ", error);
    }
  }

  const defaultImage = "/assets/user.png";
  const profileImage = user.photoURL ? user.photoURL : defaultImage;

  return (
    <div className="flex space-x-5 p-3 border-b border-gray-100">
      <Image
        src={profileImage}
        width={44}
        height={44}
        alt={insideModal ? "Profile image" : "logo"}
        className={`w-10 h-10 rounded-full z-10 bg-white`}
      />

      <div className="w-full">
        <textarea
          className="resize-none outline-none w-full min-h-[50px] text-lg"
          placeholder={insideModal ? "Send your reply" : "What's happening!?"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative mt-2">
            <Image
              src={imagePreview}
              width={200}
              height={200}
              alt="Selected image"
              className="rounded-lg max-h-48 object-contain"
            />
            <button
              onClick={removeImage}
              className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 rounded-full p-1"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center pt-5 border-t border-gray-100">
          <div className="flex space-x-1.5 cursor-pointer relative">
            <div onClick={handlePhotoIconClick}>
              <PhotoIcon className="w-[22px] h-[22px] text-[#ee0e3a] hover:text-pink-500 transition-all" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <ChartBarIcon className="w-[22px] h-[22px] text-[#ee0e3a] hover:text-pink-500 transition-all cursor-not-allowed" />
            <div>
              <FaceSmileIcon
                onClick={toggleEmojiPicker}
                className="w-[22px] h-[22px] text-[#ee0e3a] hover:text-pink-500 transition-all"
              />
            </div>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className={`absolute z-10 mt-8 -ml-4 ${
                  insideModal ? "-top-64" : ""
                } bg-white border border-gray-200 rounded-lg shadow-lg p-3 
                grid grid-cols-5 gap-2 w-52 max-h-40 overflow-y-auto`}
              >
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-2xl hover:bg-gray-100 rounded p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            <div onClick={toggleDatePicker}>
              <CalendarIcon className="w-[22px] h-[22px] text-[#ee0e3a] hover:text-pink-500 transition-all" />
            </div>
            {/* Date Picker */}
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className={`absolute z-10 mt-8 -ml-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 ${
                  insideModal ? "-top-32" : ""
                }`}
              >
                <input
                  type="date"
                  onChange={handleDateSelect}
                  className="outline-none border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            )}
            <MapPinIcon className="w-[22px] h-[22px] text-[#ee0e3a] hover:text-pink-500 transition-all cursor-not-allowed" />
          </div>

          <button
            disabled={(!text && !imageFile) || isLoading}
            onClick={() => (insideModal ? sendComment() : sendPost())}
            className="bg-[#ee0e3a] text-white w-[80px] h-[36px] rounded-full text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <ArrowPathIcon className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : (
              <span className="text-sm font-medium text-white">
                {insideModal ? "Reply" : "Bumble"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
