const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');
const Message = require('../Models/messageModel');
const expressError = require('../Utils/expressError');
const { emitEvent, deleteFilesFromCloudinary } = require('../Utils/features')
const { ALERT, REFETCH_CHATS } = require('../Constants/events')
const mongoose = require("mongoose");
const uuid = require('uuid');
const { getSockets } = require('../Utils/helper');
const { NEW_MESSAGE, NEW_MESSAGE_ALERT } = require('../Constants/events');

const adminMessage = async (req, chatId, message, members) => {
    const io = req.app.get('io');
    const senderId = new mongoose.Types.ObjectId(process.env.ADMIN_ID);
    const messageForRealTime = {
        content: message,
        _id: uuid.v4(),
        sender: {
            _id: senderId,
            username: process.env.ADMIN_USERNAME
        },
        chatId,
        createdAt: new Date().toISOString()
    }
    const messageForDb = new Message({
        content: message,
        sender: senderId,
        chatId
    })
    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime
    })
    console.log(chatId)
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })
    await messageForDb.save();
}

const newGroupChat = async (req, res, next) => {
    const { name, members } = req.body;

    if (members.length < 2) return res.status(400).json({ message: "More than 2 users are required to form a group chat" })

    const allMembers = [...members, req.userId]
    const newGroup = new Chat({ name, members: allMembers, groupChat: true, creator: req.userId })
    const newGroupChat = await newGroup.save();

    // emitEvent(req, ALERT, allMembers, { chatId: newGroupChat._id, message: `Welcome to ${name} group` })
    emitEvent(req, REFETCH_CHATS, members )
    adminMessage(req, newGroupChat._id, `Welcome to ${name}`, allMembers)

    return res.status(200).json({ succes: true, message: "Group chat created successfully" })
}

const getMyChat = async (req, res, next) => {
    const chats = await Chat.find({ members: req.userId }).populate("members", "username avatar")
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        const otherMembers = members.filter((member) => member._id.toString() !== req.userId.toString());
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map((member) => member.avatar.url) : [otherMembers[0].avatar.url],
            name: groupChat ? name : otherMembers[0].username,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.userId.toString()) {
                    prev.push(curr._id)
                }
                return prev
            }, [])
        }
    })
    return res.status(200).json({ success: true, chats: transformedChats })
}

const getMyGroups = async (req, res, next) => {
    const chats = await Chat.find({ members: req.userId, groupChat: true }).populate("members", "username avatar")
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        return {
            _id,
            groupChat,
            avatar: members.slice(0, 3).map((member) => member.avatar.url),
            name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.userId.toString()) {
                    prev.push(curr._id)
                }
                return prev
            }, [])
        }
    })

    return res.status(200).json({ success: true, groups: transformedChats })
}

const addMembers = async (req, res, next) => {
    const { chatId, newMembers } = req.body;

    if (!newMembers || newMembers.length < 1) return next(new expressError("Please provide members", 400));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))

    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400))

    if (chat.creator.toString() !== req.userId.toString()) return next(new expressError("You are not allowed to add members", 403))

    const currentMembersSet = new Set(chat.members.map((member) => member.toString()));
    const allMembersSet = new Set([...currentMembersSet, ...newMembers.map((member) => member.toString())]);
    const allMembers = [...allMembersSet];

    if (allMembers.length === chat.members.length) return next(new expressError("All members already present in the group", 400))

    if (allMembers.length > 100) return next(new expressError("Group members limit reached", 400))

    const newMembersData = await User.find({ _id: { $in: newMembers } }, "username");
    const newMembersNames = newMembersData.map((user) => user.username).join(", ");


    const updatedChat = await Chat.findByIdAndUpdate(chatId, { members: allMembers }, { new: true }).populate("members", "username")

    emitEvent(req, REFETCH_CHATS, updatedChat.members)
    adminMessage(req, chatId, `${newMembersNames} have been added to the group`, allMembers)
    return res.status(200).json({ success: true, message: "Members added successfully" })
}

const removeMember = async (req, res, next) => {
    const { chatId, userId } = req.body;
    const removedUser = await User.findById(userId, "username")

    if (!removedUser) return next(new expressError("User not found", 404));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404));
    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400));
    if (chat.creator.toString() !== req.userId.toString()) return next(new expressError("You are not allowed to remove members", 403));
    if (!chat.members.includes(userId)) return next(new expressError("User is not in the group", 400));
    if (chat.members.length - 1 < 3) return next(new expressError("Group must have at least 3 members", 400));

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { members: userId } }, { new: true })
    const eventMembers = updatedChat.members.map((member) => member._id)

    emitEvent(req, REFETCH_CHATS, chat.members, { users: [removedUser._id] })
    adminMessage(req, chatId, `${removedUser.username} has been removed from the group`, eventMembers)

    return res.status(200).json({ success: true, message: `${removedUser.username} removed successfully` })
}

const leaveGroup = async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))
    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400))
    if (chat.members.length - 1 < 3) return next(new expressError("A group must have 3 members", 400))
    if (!chat.members.includes(req.userId)) return next(new expressError("You are not in the group", 400))

    const remainingMembers = chat.members.filter((member) => member.toString() !== req.userId.toString());

    if (chat.creator.toString() === req.userId.toString()) {
        const randElement = Math.floor(Math.random() * remainingMembers.length);
        chat.creator = remainingMembers[randElement];
    }

    const user = await User.findById(req.userId, "username")
    chat.members = remainingMembers;
    const updatedChat = await chat.save();

    // emitEvent(req, ALERT, updatedChat.members, { chatId, message: `${user.username} has left the group` })
    adminMessage(req, chatId, `${user.username} has left the group`, updatedChat.members)
    return res.status(200).json({ success: true, message: "Group left successfully" })
}

const getChatDetails = async (req, res, next) => {
    if (req.query.populate === "true") {
        const chat = await Chat.findById(req.params.chatId).populate("members", "username avatar").lean();
        if (!chat) return next(new expressError("Chat not found", 404))

        chat.members = chat.members.map(({ _id, username, avatar }) => {
            return {
                _id,
                username,
                avatar: avatar.url
            }
        })
        return res.status(200).json({ success: true, chat })
    } else {
        const chat = await Chat.findById(req.params.chatId);

        if (!chat) return next(new expressError("Chat not found", 404))

        return res.status(200).json({ success: true, chat })

    }
}

const renameGroup = async (req, res, next) => {
    const { chatId } = req.params;
    const { name } = req.body;
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))
    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400))
    if (chat.creator.toString() !== req.userId.toString()) return next(new expressError("You are not allowed to rename this group", 403))

    chat.name = name;
    await chat.save();
    // emitEvent(req, ALERT, chat.members, { chatId, message: `Group name changed to ${name}` })
    adminMessage(req, chatId, `Group name changed to ${name}`, chat.members)
    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({ success: true, message: "Group renamed successfully" })
}

const deleteChat = async (req, res, next) => {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))
    if (chat.groupChat && chat.creator.toString() !== req.userId.toString()) return next(new expressError("You are not allowed to delete this group", 403))

    if (chat.groupChat && !chat.members.includes(req.userId)) return next(new expressError("You are not in the group", 403))

    const messageWithAttachments = await Message.find({
        chatId,
        attachments: {
            $exists: true,
            $ne: []
        }
    })

    const cloudinaryFiles = [];
    messageWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ public_id, url }) => {
            let fileType;
            if(url.includes("/image/upload")) fileType = "image"
            else if(url.includes("/video/upload")) fileType = "video"
            else if(url.includes("/raw/upload")) fileType = "raw"
            cloudinaryFiles.push({public_id, fileType})
        })
    })

    await deleteFilesFromCloudinary(cloudinaryFiles)
    await chat.deleteOne();
    await Message.deleteMany({ chatId })

    emitEvent(req, REFETCH_CHATS, chat.members, { users: [...chat.members] })

    res.status(200).json({ success: true, message: "Chat deleted successfully" })
}


module.exports = { newGroupChat, getMyChat, getMyGroups, addMembers, removeMember, leaveGroup, getChatDetails, renameGroup, deleteChat }