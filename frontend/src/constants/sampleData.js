// avatar = [],
//   name,
//   _id,
//   groupChat = false,
//   sameSender,
//   isOnline,
//   newMessage,
//   index = 0,
//   handleDeleteChatOpen,

export const sampleChats = [
  {
    avatar: [
      "https://www.w3schools.com/howto/img_avatar.png",
      // "https://www.w3schools.com/w3images/avatar2.png",
      // "https://www.w3schools.com/howto/img_avatar.png",
    ],
    name: "VU",
    _id: "1",
    sameSender: false,
    isOnline: false,
    newMessage: false,
    index: 0,
    groupChat: true,
    members: ["1", "2", "3"]
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "DA",
    _id: "2",
    sameSender: false,
    isOnline: false,
    newMessage: false,
    index: 0,
    members: ["1", "2", "3"]
  }
]

export const sampleUsers = [
  {
    avatar: [
      // "https://www.w3schools.com/howto/img_avatar.png",
      "https://www.w3schools.com/w3images/avatar2.png",
      // "https://www.w3schools.com/howto/img_avatar.png",
    ],
    name: "VU",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "DA",
    _id: "2",

  }
]

export const sampleNotifications = [
  {
    _id: "1",
    sender: {
      "name": "VU",
      "avatar": "https://www.w3schools.com/w3images/avatar2.png",
    }

  }, {
    _id: "2",
    sender: {
      "name": "DA",
      "avatar": "https://www.w3schools.com/w3images/avatar2.png",
    }
  }
]