const Chat = require('../Models/chatModel')
const emitEvent = require('../Utils/features')

const newGroupChat = async (req, res, next) => {
    const { name, members } = req.body;

    if (members.length < 2) return res.status(400).json({ message: "More than 2 users are required to form a group chat" })

    const allMembers = [...members, req.userId]
    const newGroup = new Chat({ name, members: allMembers, isGroupChat: true, creator: req.userId })
    await newGroup.save();

    emitEvent(req, "ALERT", allMembers, `Welcome to ${name} group`)
    emitEvent(req, "REFETCH_CHATS", members)

    return res.status(200).json({ succes: true, message: "Group chat created successfully" })
}

module.exports = { newGroupChat }