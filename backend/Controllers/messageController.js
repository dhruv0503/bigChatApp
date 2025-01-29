const Message = require("../Models/messageModel")
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const expressError = require("../Utils/expressError");
const {emitEvent} = require("../Utils/features")


const getMessages = async (req, res, next) => {
    const {id} = req.params;
    const { page = 1 } = req.query;

    const chat = await Chat.findById(id);
    if (!chat) return next(new expressError("Chat not found", 404))
    if (chat.members.includes(req.userId) === false) return next(new expressError("You are not in the chat", 403))

    const limit = 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("sender", "username avatar").lean();
    
    const totalMessages = await Message.countDocuments({ chat: id })
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
            }
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

    const attachments = []

    const messageForDB = {
        content: "",
        sender: req.userId,
        attachments,
        chat: chatId
    }

    const messageForRealTime = {
        ...messageForDB,
        sender: {
            _id: req.userId,
            username: user.username
        },
    }

    const message = await new Message(messageForDB).save();

    emitEvent(req, "NEW_ATTACHMENT", chat.members, { message: messageForRealTime, chatId })
    emitEvent(req, "NEW_MESSAGE", chat.members, chatId)

    return res.status(200).json({ success: true, message })
}

module.exports = { getMessages, sendAttachment }