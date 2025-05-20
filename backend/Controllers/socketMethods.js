const uuid = require('uuid')
const Message = require('../Models/messageModel')
const { getSockets, getAllSockets, getOfflineUserIds} = require('../Utils/helper')
const { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } = require('../Constants/events')
const User = require('../Models/userModel')

const updateUnreadMessages = async (offlineUsers, chatId) => {
    const chatKey = chatId.toString();
    await Promise.all(
        offlineUsers.map(async (userId) => {
            const user = await User.findById(userId);
            if (!user) return;
            if (!user.unreadChats) user.unreadChats = {};
            user.unreadChats[chatKey] = (user.unreadChats[chatKey] || 0) + 1;
            await user.save();
        })
    );
}

module.exports.onNewMessage = async (io, chatId, members, message, user) => {
    const messageForRealTime = {
        content: message,
        _id: uuid.v4(),
        sender: {
            _id: user._id,
            username: user.username
        },
        chatId,
        createdAt: new Date().toISOString()
    }
    const messageForDb = new Message({
        content: message,
        sender: user._id,
        chatId
    })
    const membersSocket = getSockets(members)

    if(membersSocket.length < members.length) {
        const offlineUsers = getOfflineUserIds(members);
        await updateUnreadMessages(offlineUsers, chatId);
    }

    io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime
    })
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })
    await messageForDb.save();
}

module.exports.onTyping = (io, members, chatId, userId) => {
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(START_TYPING, { chatId, userId })
}

module.exports.onStopTyping = (io, members, chatId, userId) => {
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(STOP_TYPING, { chatId, userId })
}