import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    // isAdmin : false,
    // loader : true
  },
  reducers: {
    updateUser : (state, action) => {
        state.user = action.payload;
        // state.loader = false;
    }
  },
});

export default authSlice;

export const {updateUser} = authSlice.actions;