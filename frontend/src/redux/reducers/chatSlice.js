import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    notificationCount: 0,
    newMessageAlert : getOrSaveFromStorage({key : NEW_MESSAGE_ALERT, get : true}) || [
      {
        chatId : "",
        count : 0
      }
    ]
  },
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert : (state, action) => {
      const chatId = action.payload.chatId
      const index = state.newMessageAlert.findIndex(
        (item) => item.chatId === chatId
      );

      if(index !== -1) state.newMessageAlert[index].count++;
      else state.newMessageAlert.push({ chatId, count : 1})
    },
    removeNewMessageAlert : (state, action) => {
      state.newMessageAlert = state.newMessageAlert.filter(
        (item) => item.chatId !== action.payload
      )
    },
    loadMessagesAlert : (state, action) => {
      const unreadMessages = action.payload;
      state.newMessageAlert = Object.entries(unreadMessages).map(
          ([chatId, count]) => ({ chatId, count })
      )
    }
  },
});

export default chatSlice;

export const {
  incrementNotificationCount,
  resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessageAlert,
  loadMessagesAlert
} = chatSlice.actions;