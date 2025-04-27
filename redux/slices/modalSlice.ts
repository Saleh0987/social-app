import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
 signUpModalOpen: false,
 loginModalOpen: false,
 commentModalOpen: false,
 logoutModalOpen: false,
 profileModalOpen: false,
 likesModalOpen: false,
 commentPostDetails: {
  name: "",
  username: "",
  id: "",
  text: "",
  image: "",
  postImage: "",
  commentImage: "",
 },
 likesPostDetails: {
  id: "",

 },
};

const modalSlice = createSlice({
 name: "modal",
 initialState,
 reducers: {
  openSignUpModal: (state) => {
   state.signUpModalOpen = true;
  },
  closeSignUpModal: (state) => {
   state.signUpModalOpen = false;
  },
  openLoginModal: (state) => {
   state.loginModalOpen = true;
  },
  closeLoginModal: (state) => {
   state.loginModalOpen = false;
  },
  openCommentModal: (state) => {
   state.commentModalOpen = true;
  },
  closeCommentModal: (state) => {
   state.commentModalOpen = false;
  },
  openLogoutModal: (state) => {
   state.logoutModalOpen = true;
  },
  closeLogoutModal: (state) => {
   state.logoutModalOpen = false;
  },
  openProfileModal: (state) => {
   state.profileModalOpen = true;
  },
  closeProfileModal: (state) => {
   state.profileModalOpen = false;
  },
  openLikesModal: (state, action: PayloadAction<{ id: string; }>) => {
   state.likesModalOpen = true;
   state.likesPostDetails.id = action.payload.id;
  },
  closeLikesModal: (state) => {
   state.likesModalOpen = false;
   state.likesPostDetails.id = ""; // Reset id when closing
  },
  setCommentPostDetails: (state, action) => {
   state.commentPostDetails.name = action.payload.name;
   state.commentPostDetails.username = action.payload.username;
   state.commentPostDetails.id = action.payload.id;
   state.commentPostDetails.text = action.payload.text;
   state.commentPostDetails.image = action.payload.image;
   state.commentPostDetails.postImage = action.payload.postImage;
   state.commentPostDetails.commentImage = action.payload.commentImage;
  },
  setLikesPostDetails: (state, action) => {
   state.likesPostDetails = action.payload;
  },
 },
});

export const {
 openSignUpModal,
 closeSignUpModal,
 openLoginModal,
 closeLoginModal,
 openCommentModal,
 closeCommentModal,
 setCommentPostDetails,
 openLogoutModal,
 closeLogoutModal,
 openProfileModal,
 closeProfileModal,
 openLikesModal,
 closeLikesModal,
 setLikesPostDetails,
} = modalSlice.actions;

export default modalSlice.reducer;