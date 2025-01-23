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

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: 'abcd',
        url: "https://www.w3schools.com/w3images/avatar2.png"
      }
    ],
    _id: "xyz",
    sender: {
      _id: "bhc",
      name: "Hella Name"
    },
    chat: "chatId",
    createdAt: '2025-01-16T10:33:27.149Z'
  },
  {
    attachments: [],
    content: "Great Message2",
    _id: "xyz2",
    sender: {
      _id: "1",
      name: "Hella Name2"
    },
    chat: "chatId2",
    createdAt: '2025-01-16T10:33:27.149Z'
  }
]

export const dashboardData = {
  users: [
    {
      _id: "1",
      name: "VU",
      avatar: "https://www.w3schools.com/w3images/avatar2.png",
      username: "v_u",
      friends: 20,
      groups: 10
    },
    {
      _id: "2",
      name: "DA",
      avatar: "https://www.w3schools.com/w3images/avatar2.png",
      username: "v_u",
      friends: 20,
      groups: 10
    }
  ],
  chats: [
    {
      _id: "1",
      name: "VU",
      avatar: ["https://www.w3schools.com/w3images/avatar2.png"],
      totalMembers: 20,
      members: [
        { _id: 1, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
        { _id: 2, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
        { _id: 3, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
      ],
      totalMessages: 10,
      creator: {
        _id: "1",
        name: "VU",
        avatar: "https://www.w3schools.com/w3images/avatar2.png",
      }
    },
    {
      _id: "2",
      name: "DA",
      avatar: ["https://www.w3schools.com/w3images/avatar2.png"],
      totalMembers: 20,
      members: [
        { _id: 1, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
        { _id: 2, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
        { _id: 3, avatar: "https://www.w3schools.com/w3images/avatar2.png" },
      ],
      totalMessages: 10,
      creator: {
        _id: "1",
        name: "VU",
        avatar: "https://www.w3schools.com/w3images/avatar2.png",
      }
    }
  ],
  messages: [
    {
      attachments: [
        {
          public_id: 'abcd',
          url: "https://www.w3schools.com/w3images/avatar2.png"
        }
      ],
      _id: "xyz",
      sender: {
        _id: "bhc",
        avatar : "https://www.w3schools.com/w3images/avatar2.png",
        name: "Hella Name"
      },
      chat: "chatId",
      groupChat: false,
      createdAt: '2025-01-16T10:33:27.149Z'
    },
    {
      attachments: [],
      content: "Great Message2",
      _id: "XXXX",
      sender: {
        _id: "1",
        avatar : "https://www.w3schools.com/w3images/avatar2.png",
        name: "Hella Name2"
      },
      chat: "chatId2",
      groupChat : true,
      createdAt: '2025-01-16T10:33:27.149Z'
    }
  ]
}