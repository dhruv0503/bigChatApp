const Message = require("../Models/messageModel")
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const expressError = require("../Utils/expressError");
const { emitEvent, uploadToCloudinary } = require("../Utils/features")
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('../Constants/events')


const getMessages = async (req, res, next) => {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const chat = await Chat.findById(id);
    if (!chat) return next(new expressError("Chat not found", 404))
    if (chat.members.includes(req.userId) === false) return next(new expressError("You are not in the chat", 403))

    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("sender", "username avatar").lean();

    const totalMessages = await Message.countDocuments({ chatId: id })
    const totalPages = Math.ceil(totalMessages / limit);

    const transformedMessages = messages.reverse().map(({ _id, sender, content, attachments, createdAt }) => {
        return {
            _id,
            content,
            attachments,
            createdAt,
            sender: {
                _id: sender._id,
                username: sender.username,
                avatar: sender.avatar.url
            },
            chatId: id
        }
    })

    return res.status(200).json({ success: true, messages: transformedMessages, totalPages })
}

const sendAttachment = async (req, res, next) => {
    const { chatId } = req.body;

    const chat = await Chat.findById(chatId);
    const user = await User.findById(req.userId, "username")
    const files = req.files || [];

    if (!chat) return next(new expressError("Chat not found", 404))

    if (files.length < 1) return next(new expressError("Please provide attachments", 400))
    if (files.length > 5) return next(new expressError("You can only send 5 attachments at a time", 400))
    console.log(files);
    const attachments = await uploadToCloudinary(files)
    const messageForDB = {
        content: "",
        sender: req.userId,
        attachments,
        chatId
    }

    const messageForRealTime = {
        ...messageForDB,
        sender: {
            _id: req.userId,
            username: user.username
        },
    }

    const message = await new Message(messageForDB)
    message.save();

    emitEvent(req, NEW_MESSAGE, chat.members, { message: messageForRealTime, chatId })
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, chatId)

    return res.status(200).json({ success: true, message })
}

module.exports = { getMessages, sendAttachment }