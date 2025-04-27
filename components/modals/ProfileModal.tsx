"use client";

import {useState, useEffect} from "react";
import {closeProfileModal} from "@/redux/slices/modalSlice";
import {RootState} from "@/redux/store";
import {Modal} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {XMarkIcon, PhotoIcon} from "@heroicons/react/24/outline";
import Image from "next/image";
import {auth, db, storage} from "@/firebase";
import {updateProfile} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import {signInUser} from "@/redux/slices/userSlice";

export default function ProfileModal() {
  const open = useSelector((state: RootState) => state.modals.profileModalOpen);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync name state when user changes
  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  // Check if there are changes
  const hasChanges = name.trim() !== (user?.name || "") || file !== null;

  // Handle file selection and generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Generate preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => setPreviewURL(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle profile update
  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    // Check for no changes
    if (!hasChanges) {
      alert("No changes were made.");
      setIsEditing(false);
      setFile(null);
      setFileName("");
      setPreviewURL(null);
      return;
    }

    setIsLoading(true);
    try {
      let photoURL = user?.photoURL || "/assets/user.png";

      // Upload new profile picture if provided
      if (file) {
        const storageRef = ref(storage, `images/${Date.now()}_${name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        photoURL = await new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      // Update Firebase Authentication profile
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found.");
      }

      await updateProfile(currentUser, {
        displayName: name,
        photoURL,
      });

      // Update Redux store
      dispatch(
        signInUser({
          name,
          username: user.username,
          email: user.email,
          uid: user.uid,
          photoURL,
        })
      );

      // Update posts and comments in Firestore
      const batch = writeBatch(db);

      // Update posts where uid matches
      const postsQuery = query(
        collection(db, "posts"),
        where("username", "==", user.username)
      );
      const postsSnapshot = await getDocs(postsQuery);
      postsSnapshot.forEach((postDoc) => {
        const postRef = doc(db, "posts", postDoc.id);
        batch.update(postRef, {
          name,
          image: photoURL,
        });
      });

      // Update comments where uid matches
      const allPostsQuery = collection(db, "posts");
      const allPostsSnapshot = await getDocs(allPostsQuery);
      allPostsSnapshot.forEach((postDoc) => {
        const comments = postDoc.data().comments || [];
        const updatedComments = comments.map((comment: any) =>
          comment.username === user.username
            ? {...comment, name, image: photoURL}
            : comment
        );
        if (
          comments.some((comment: any) => comment.username === user.username)
        ) {
          const postRef = doc(db, "posts", postDoc.id);
          batch.update(postRef, {comments: updatedComments});
        }
      });

      // Commit the batch
      await batch.commit();

      // Reset edit state
      setIsEditing(false);
      setFile(null);
      setFileName("");
      setPreviewURL(null);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setName(user?.name || "");
    setFile(null);
    setFileName("");
    setPreviewURL(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        dispatch(closeProfileModal());
        handleCancel();
      }}
      className="flex items-center justify-center"
      aria-labelledby="profile-modal-title"
    >
      <div className="max-w-[400px] w-full bg-white rounded-xl outline-none relative shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 transition"
          onClick={() => {
            dispatch(closeProfileModal());
            handleCancel();
          }}
          aria-label="Close profile modal"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center p-6 sm:p-8">
          {isEditing ? (
            <>
              {/* Edit Mode */}
              <h2
                id="profile-modal-title"
                className="text-xl font-bold text-gray-900 mb-4"
              >
                Edit Profile
              </h2>
              <div className="w-full space-y-4">
                {/* Name Input */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full h-[48px] border border-gray-200 outline-none pl-3 rounded-[4px] focus:border-[#ee0e3a] transition-all"
                />
                {/* Profile Picture Upload */}
                <div className="w-full h-[48px] border border-gray-200 rounded-[4px] focus-within:border-[#ee0e3a] transition-all flex items-center px-3">
                  <PhotoIcon className="w-6 h-6 text-[#ee0e3a] mr-2" />
                  <label
                    htmlFor="file-upload"
                    className="flex-grow cursor-pointer text-gray-500 truncate"
                  >
                    {fileName || "Upload profile image"}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {file && (
                    <button
                      onClick={() => {
                        setFile(null);
                        setFileName("");
                        setPreviewURL(null);
                      }}
                      className="text-[#ee0e3a] text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {/* Current or New Profile Picture */}
                <div className="flex flex-col items-center mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {file ? "New Profile Picture" : "Current Profile Picture"}
                  </p>
                  <div className="relative w-20 h-20">
                    <Image
                      src={previewURL || user?.photoURL || "/assets/user.png"}
                      alt={
                        file
                          ? "New profile picture preview"
                          : `${user?.name || "User"}'s profile picture`
                      }
                      width={80}
                      height={80}
                      className="size-24 rounded-full object-contain"
                    />
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 mt-6 w-full">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#ee0e3a] text-white rounded-full text-sm font-medium disabled:opacity-50"
                  disabled={isLoading || !name.trim() || !hasChanges}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* View Mode */}
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={user?.photoURL || "/assets/user.png"}
                  alt={`${user?.name || "User"}'s profile picture`}
                  width={44}
                  height={44}
                  className="size-24 rounded-full object-contain"
                />
              </div>
              <div className="text-center space-y-2">
                <h2
                  id="profile-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {user?.name || "Anonymous"}
                </h2>
                <p className="text-sm text-gray-600">
                  @{user?.username || "unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  {user?.email || "No email provided"}
                </p>
              </div>
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-[#ee0e3a] text-white rounded-full text-sm font-medium"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
