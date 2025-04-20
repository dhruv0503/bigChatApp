const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')
const Message = require('../Models/messageModel');
const expressError = require('../Utils/expressError');
const { cookieOptions, clearCookieOptions} = require('../Utils/features');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

module.exports.adminLogin = async (req, res, next) => {
    const { secretKey } = req.body;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return next(new expressError("Invalid Key", 401))
    }
    const token = jwt.sign(secretKey, process.env.JWT_SECRET)
    return res.status(200).cookie('adminToken', token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60
    }).json({
        success: true,
        message: "Authenticated Successfully",
    })
}

module.exports.adminLogout = async (req, res, next) => {
    return res.status(200).clearCookie('adminToken', clearCookieOptions).json({
        success: true,
        message: "Logged Out Successfully"
    })
}

module.exports.getAdminLogin = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated Successfully"
    })
}

module.exports.getUsers = async (req, res, next) => {
    const users = await User.find({ _id: { $ne: process.env.ADMIN_ID } }).lean();
    const transformedUsers = [];

    for (const user of users) {
        const chats = await Chat.find({ members: user._id });

        const singleChats = chats.filter((chat) => !chat.groupChat);
        const transformedUser = {
            ...user,
            singleChats: singleChats.length,
            groupChats: chats.length - singleChats.length,
            avatar: user.avatar.url
        };

        transformedUsers.push(transformedUser);
    }

    res.status(200).json({
        success: true,
        users: transformedUsers
    });
}

module.exports.allChats = async (req, res, next) => {
    const chats = await Chat.find().populate("members", "username avatar").populate("creator", "username avatar").lean();

    const transformedChats = [];

    for (const chat of chats) {

        const totalMessages = await Message.countDocuments({ chatId: chat._id });

        const transformedChat = {
            _id: chat._id,
            avatar: chat.groupChat ? chat.members.slice(0, 3)
                .map((member) => member.avatar.url) :
                chat.members.map(member => member.avatar.url),
            name: chat.groupChat ? chat.name : ` ${chat.members[0].username} - ${chat.members[1].username} `,
            totalMembers: chat.members.length,
            members: chat.members.map(member => member.avatar.url),
            groupChat: chat.groupChat,
            creator: {
                username: chat.creator.username,
                avatar: chat.creator.avatar.url
            },
            totalMessages
        }
        transformedChats.push(transformedChat);
    }

    res.status(200).json({
        success: true,
        chats: transformedChats
    })
}

module.exports.allMessages = async (req, res, next) => {
    const messages = await Message
        .find({ sender: { $ne: process.env.ADMIN_ID } })
        .populate("sender", "username avatar")
        .populate("chatId", "groupChat createdAt")
        .sort({createdAt : -1})
        .lean();

    const transformedMessages = messages.map(({ _id, attachments, content, sender, chatId, createdAt }) => ({
        _id,
        attachments: attachments.map(attach => attach.url),
        content,
        sender: {
            _id: sender._id,
            username: sender.username,
            avatar: sender.avatar.url
        },
        chat : chatId._id,
        groupChat: chatId.groupChat ? "Yes" : "No",
        createdAt: createdAt.toLocaleString()
    }))

    res.status(200).json({
        success: true,
        messages: transformedMessages
    })
}

module.exports.getDashboardStats = async (req, res, next) => {
    const adminId = new mongoose.Types.ObjectId(process.env.ADMIN_ID)
    const [totalUsers, totalChats, totalMessages, singleChats] = await Promise.all([
        User.countDocuments(),
        Chat.countDocuments({}),
        Message.countDocuments({ sender: { $ne: adminId } }),
        Chat.countDocuments({ groupChat: false })
    ])

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const graphMessages = await Message.find({ createdAt: { $gt: sevenDaysAgo } }).select('createdAt');

    const last7DaysStats = new Array(7).fill(0);
    const dayInMs = 1000 * 60 * 60 * 24;

    graphMessages.forEach(msg => {
        const msgDate = new Date(msg.createdAt);
        msgDate.setUTCHours(0, 0, 0, 0);

        const dif = Math.floor((today - msgDate) / dayInMs);
        if (dif >= 0 && dif < 7) {
            last7DaysStats[6 - dif]++;
        }
    });
    stats = {
        totalUsers: totalUsers - 1,
        totalChats,
        totalMessages,
        singleChats,
        groupChats: totalChats - singleChats,
        last7DaysStats
    }

    res.status(200).json({
        success: true,
        stats,
    })
}

