import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLogin: false,
    loader: true
  },
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    }, setIsLogin: (state, action) => {
      state.isLogin = action.payload;
      state.loader = false;
    }
  },
});

export default authSlice;

export const { updateUser, setIsLogin } = authSlice.actions;