import { createSlice } from "@reduxjs/toolkit";

const miscSlice = createSlice({
  name: "misc",
  initialState: {
    isNewGroup: false,
    isAddMember: false,
    isNotification: false,
    isMobile: false,
    isMobileGroup : true,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
      chatId: "",
      groupChat: false
    },
    areOptionsOpen: false,
  },
  onlineUsers: [],
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setAreOptionsOpen: (state, action) => {
      state.areOptionsOpen = action.payload;
    },
    setOnlineUsers : (state, action) => {
      state.onlineUsers = action.payload.onlineUsers;
    },
    setIsMobileGroup : (state, action) => {
      state.isMobileGroup = action.payload;
    }
  },
});

export default miscSlice;

export const {
  setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setAreOptionsOpen,
  setOnlineUsers,
    setIsMobileGroup
} = miscSlice.actions;