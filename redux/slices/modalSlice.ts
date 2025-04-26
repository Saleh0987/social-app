import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 signUpModalOpen: false,
 loginModalOpen: false,
 commentModalOpen: false,
 logoutModalOpen: false,
 profileModalOpen: false,
 commentPostDetails: {
  name: "",
  username: "",
  id: "",
  text: "",
  image: "",
  postImage: "",
  commentImage: "",
 }
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
  setCommentPostDetails: (state, action) => {
   state.commentPostDetails.name = action.payload.name;
   state.commentPostDetails.username = action.payload.username;
   state.commentPostDetails.id = action.payload.id;
   state.commentPostDetails.text = action.payload.text;
   state.commentPostDetails.image = action.payload.image;
   state.commentPostDetails.postImage = action.payload.postImage;
   state.commentPostDetails.commentImage = action.payload.commentImage;
  },

 },
});

export const { openSignUpModal, closeSignUpModal,
 openLoginModal, closeLoginModal,
 openCommentModal, closeCommentModal,
 setCommentPostDetails,
 openLogoutModal, closeLogoutModal,
 openProfileModal, closeProfileModal,
} = modalSlice.actions;

export default modalSlice.reducer;