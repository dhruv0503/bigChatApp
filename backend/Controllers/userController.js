const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')
const Request = require('../Models/requestModel')

module.exports.getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);
    res.status(200).json({
        success: true,
        user
    })
}

module.exports.myFriends = async (req, res, next) => {
    const allChatMembers = await Chat.find({ groupChat: false, members: req.userId });
    const myFriends = allChatMembers.flatMap((chat) => chat.members).filter((member) => member.toString() !== req.userId.toString());
    const friends = await User.find({ _id: { $in: myFriends } })
    res.status(200).json({
        success: true,
        friends
    })
}

module.exports.searchUser = async (req, res, next) => {
    const { username = "" } = req.query;
    const allChatMembers = await Chat.find({ groupChat: false, members: req.userId });
    const myFriends = allChatMembers.flatMap((chat) => chat.members).filter((member) => member.toString() !== req.userId.toString());

    const searchQuery = {
        _id: { $nin: [...myFriends, req.userId] },
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
    const requests = await Request.find({ receiver: req.userId }).populate("sender", "name avatar")

    const transformedRequests = requests.map((request) => {
        return {
            _id: request._id,
            sender: {
                _id: request.sender._id,
                name: request.sender.name,
                avatar: request.sender.avatar.url
            }
        }
    })

    return res.status(200).json({
        success: true,
        notifications : transformedRequests
    })
}