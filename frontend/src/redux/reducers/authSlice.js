import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: undefined,
    loader: true,
    isAdmin: false
  },
  reducers: {
    updateUser : (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    setIsAdmin : (state, action) => {
      state.isAdmin = action.payload;
    }
  },
});

export default authSlice;

export const { updateUser, setIsAdmin } = authSlice.actions;
