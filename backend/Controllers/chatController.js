const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');
const Message = require('../Models/messageModel');
const expressError = require('../Utils/expressError');
const { emitEvent, deleteFilesFromCloudinary } = require('../Utils/features')
const {ALERT, REFETCH_CHATS} = require('../Constants/events')

const newGroupChat = async (req, res, next) => {
    const { name, members } = req.body;

    if (members.length < 2) return res.status(400).json({ message: "More than 2 users are required to form a group chat" })

    const allMembers = [...members, req.userId]
    const newGroup = new Chat({ name, members: allMembers, groupChat: true, creator: req.userId })
    await newGroup.save();

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`)
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({ succes: true, message: "Group chat created successfully" })
}

const getMyChat = async (req, res, next) => {
    const myInfo = await User.findById(req.userId);
    const chats = await Chat.find({ members: req.userId, groupChat : false }).populate("members", "username avatar")
    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
        const otherMember = members.find((member) => member._id.toString() !== req.userId.toString())
        return {
            _id,    
            groupChat,
            avatar: [otherMember.avatar.url],
            username:  otherMember.username,
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

    return res.status(200).json({ success: true, chats: transformedChats })
}

const addMembers = async (req, res, next) => {
    const { chatId, newMembers } = req.body;

    if (!newMembers || newMembers.length < 1) return next(new expressError("Please provide members", 400));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))

    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400))

    if (chat.creator.toString() !== req.userId.toString()) next(new expressError("You are not allowed to add members", 403))

    const currentMembersSet = new Set(chat.members.map((member) => member.toString()));
    const allMembersSet = new Set([...currentMembersSet, ...newMembers.map((member) => member.toString())]);
    const allMembers = [...allMembersSet];

    if (allMembers.length === chat.members.length) return next(new expressError("All members already present in the group", 400))

    if (allMembers.length > 100) return next(new expressError("Group members limit reached", 400))

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { members: allMembers }, { new: true }).populate("members", "username")
    const allUsersName = updatedChat.members.map((member) => member.username).join(", ")

    emitEvent(req, ALERT, updatedChat.members, `${allUsersName} have been added to the group`)
    emitEvent(req, REFETCH_CHATS, updatedChat.members)
    return res.status(200).json({ success: true, message: "Members added successfully" })
}

const removeMember = async (req, res, next) => {
    const { chatId, userId } = req.body;
    const removedUser = await User.findById(userId, "username")

    if (!removedUser) return next(new expressError("User not found", 404));

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))
    if (!chat.groupChat) return next(new expressError("This is not a group chat", 400))
    if (chat.creator.toString() !== req.userId.toString()) next(new expressError("You are not allowed to remove members", 403))
    if (!chat.members.includes(userId)) return next(new expressError("User is not in the group", 400))
    if (chat.members.length - 1 < 3) return next(new expressError("Group must have at least 3 members", 400));

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { members: userId } }, { new: true })

    emitEvent(req, ALERT, updatedChat.members, `${removedUser} have been removed from the group`)
    emitEvent(req, REFETCH_CHATS, updatedChat.members)

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

    emitEvent(req, ALERT, updatedChat.members, `${user.username} has left the group`)
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

    emitEvent(req, ALERT, chat.members, `Group name changed to ${name}`)
    emitEvent(req, REFETCH_CHATS, chat.members)

    return res.status(200).json({ success: true, message: "Group renamed successfully" })
}

const deleteChat = async (req, res, next) => {
    const { chatId } = req.params;
    // console.log(chatId);

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new expressError("Chat not found", 404))
    if (chat.groupChat && chat.creator.toString() !== req.userId.toString()) return next(new expressError("You are not allowed to delete this group", 403))

    if (chat.groupChat && !chat.members.includes(req.userId)) return next(new expressError("You are not in the group", 403))

    const messageWithAttachments = await Message.find({
        chat: chatId,
        attachments: {
            $exists: true,
            $ne: []
        }
    })

    const publicIds = [];
    messageWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ public_id }) => {
            publicIds.push(public_id)
        })
    })

    await deleteFilesFromCloudinary(publicIds)
    await chat.deleteOne();
    await Message.deleteMany({ chat: chatId })

    emitEvent(req, REFETCH_CHATS, chat.members)

    res.status(200).json({ success: true, message: "Chat deleted successfully" })
}


module.exports = { newGroupChat, getMyChat, getMyGroups, addMembers, removeMember, leaveGroup, getChatDetails, renameGroup, deleteChat }