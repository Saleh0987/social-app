import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 name: "",
 username: "",
 email: "",
 uid: "",
 photoURL: "",
};

const userSlice = createSlice({
 name: "user",
 initialState,
 reducers: {
  signInUser: (state, action) => {
   state.name = action.payload.name;
   state.username = action.payload.username;
   state.email = action.payload.email;
   state.uid = action.payload.uid;
   state.photoURL = action.payload.photoURL;
  },
  signOutUser: (state) => {
   state.name = "";
   state.username = "";
   state.email = "";
   state.uid = "";
   state.photoURL = "";
  },
 },
});

export const { signInUser, signOutUser } = userSlice.actions;

export default userSlice.reducer;