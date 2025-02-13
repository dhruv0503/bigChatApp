const uuid = require('uuid')
const Message = require('../Models/messageModel')
const { getSockets } = require('../Utils/helper')
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('../Constants/events')

module.exports.onNewMessage = async (io, chatId, members, message, user) => {
    const messageForRealTime = {
        content: message,
        _id: uuid.v4(),
        sender: {
            _id: user._id,
            username: user.username
        },
        chat: chatId,
        createdAt: new Date().toISOString()
    }
    const messageForDb = new Message({
        content: message,
        sender: user._id,
        chat: chatId
    })

    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime
    })
    io.to(membersSocket).emit(NEW_MESSAGE, { chatId })

    await messageForDb.save();
}