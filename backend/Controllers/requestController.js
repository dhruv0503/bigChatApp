const Request = require('../Models/requestModel');
const Chat = require('../Models/chatModel');
const { emitEvent } = require('../Utils/features');
const expressError = require('../Utils/expressError');
const { REFETCH_CHATS, NEW_REQUEST } = require('../Constants/events');

module.exports.sendFriendRequest = async (req, res, next) => {
    const { userId } = req.body;

    const request = await Request.findOne({
        $or: [
            { sender: req.userId, receiver: userId },
            { sender: userId, receiver: req.userId }
        ]
    })

    if (request) return next(new expressError("Request already sent", 400))

    const newRequest = new Request({
        sender: req.userId,
        receiver: userId
    })

    await newRequest.save();

    emitEvent(req, NEW_REQUEST, [userId], {userId})

    return res.status(200).json({
        success: true,
        message: "Friend request sent successfully"
    })
}

module.exports.acceptFriendRequest = async (req, res, next) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId).populate("sender", "name username avatar").populate("receiver", "name username avatar");

    if (!request) return next(new expressError("Request not found", 404))

    if (request.receiver._id.toString() !== req.userId) return next(new expressError("You are not authorized to accept this request", 401))

    if (!accept) {
        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Friend request rejected"
        })
    }

    const members = [request.sender._id, request.receiver._id];

    const newChat = new Chat({
        members,
        name: `${request.sender.name} - ${request.receiver.name}`,
        creator: request.sender._id
    })

    await newChat.save();
    await request.deleteOne();
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(200).json({
        success: true,
        message: "Friend request accepted",
        sender: request.sender._id
    })
}