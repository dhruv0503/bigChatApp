import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLogin: false,
    loader: true,
    isAdmin: false
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    }, setIsLogin: (state, action) => {
      state.isLogin = action.payload;
      state.loader = false;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
      state.loader = false;
    }
  },
});

export default authSlice;

export const { updateUser, setIsLogin, setIsAdmin } = authSlice.actions;