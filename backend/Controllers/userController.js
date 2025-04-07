const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')
const Request = require('../Models/requestModel')
const { getMyFriends } = require('../Utils/features')
const { getSocket, getAllSockets } = require('../Utils/helper')

module.exports.getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);
    res.status(200).json({
        success: true,
        user
    })
}

module.exports.myFriends = async (req, res, next) => {
    const friends = await getMyFriends(req);
    res.status(200).json({
        success: true,
        friends
    })
}

module.exports.searchUser = async (req, res, next) => {
    const { username = "" } = req.query;
    const userId = req.userId.toString();
    const allChatMembers = await Chat.find({ groupChat: false, members: req.userId });
    const myFriends = new Set(allChatMembers.flatMap((chat) => chat.members).map((member) => member.toString()))
    myFriends.delete(userId);
    if(myFriends.has(process.env.ADMIN_ID)) myFriends.delete(process.env.ADMIN_ID);
    const alreadyRequestSentUsers = await Request.find({
        $or: [{ sender: req.userId }, { receiver: req.userId }]
    })


    const requestedUsers = new Set(
        alreadyRequestSentUsers.map((req) => {

            return req.sender.toString() === userId ? req.receiver.toString() : req.sender.toString()
        }))
    const requestSet = (new Set([...myFriends, userId, ...requestedUsers]))

    const searchQuery = {
        _id: { $nin: [...myFriends, userId, ...requestedUsers] },
    }

    if (username.trim()) searchQuery.username = { $regex: username, $options: "i" }

    const searchList = await User.find(searchQuery).lean();

    const updatedSearchList = searchList.map((user) => {
        return {
            ...user,
            avatar: user.avatar?.url
        }
    })
    return res.status(200).json({
        success: true,
        updatedSearchList
    })
}

module.exports.getMyNotifications = async (req, res, next) => {
    const requests = await Request.find({ receiver: req.userId }).populate("sender", "username avatar")

    const transformedRequests = requests.map((request) => {
        return {
            _id: request._id,
            sender: {
                _id: request.sender._id,
                username: request.sender.username,
                avatar: request.sender.avatar.url
            }
        }
    })

    return res.status(200).json({
        success: true,
        notifications: transformedRequests,
    })
}