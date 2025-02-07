import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAdmin : false,
    loader : true
  },
  reducers: {
    userExists : (state, action) => {
        state.user = action.payload;
        state.loader = false;
    },
    userNotExists : (state) => {
        state.user = null;
        state.loader = false;
    },
  },
});

export default authSlice;

export const {userExists, userNotExists} = authSlice.actions;