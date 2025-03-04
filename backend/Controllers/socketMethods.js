const uuid = require('uuid')
const Message = require('../Models/messageModel')
const { getSockets, getAllSockets } = require('../Utils/helper')
const { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } = require('../Constants/events')

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
    // console.log(messageForRealTime);
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