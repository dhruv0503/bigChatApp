const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')

module.exports.getUsers = async (req, res, next) => {
    const users = await User.find({ _id: { $ne: req.userId } }).lean();
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
        transformedUsers
    });
}