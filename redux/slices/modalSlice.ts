import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 signUpModalOpen: false,
 loginModalOpen: false,
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
  }
 },
});

export const { openSignUpModal, closeSignUpModal,
 openLoginModal, closeLoginModal
} = modalSlice.actions;

export default modalSlice.reducer;