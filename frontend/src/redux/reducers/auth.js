import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

export default authSlice = createSlice({
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
    setAdmin : (state, action) => {
        state.isAdmin = action.payload;
    }
  },
});

export const {userExists, userNotExists, setAdmin} = authSlice.actions;