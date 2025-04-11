const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {v4: uuid} = require('uuid')
const streamifier = require('streamifier')
const {getSockets} = require('./helper')
const cloudinary = require('cloudinary').v2
const Chat = require("../Models/chatModel")
const User = require("../Models/userModel")

const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    sameSite: "none",
    secure: true
}

const clearCookieOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true
}

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })
}

const sendToken = (res, user, code, msg) => {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    res.cookie("jsonToken", token, cookieOptions)
    return res.status(code).json({
        success: true,
        message: msg,
        user
    })
}

const getMyFriends = async (req) => {
    const allChatMembers = await Chat.find({groupChat: false, members: req?.userId});
    const myFriends = allChatMembers.flatMap((chat) => chat.members).filter((member) => member.toString() !== req.userId.toString());
    const friends = await User.find({_id: {$in: myFriends}})
    return friends;
}

const deleteFilesFromCloudinary = async (files) => {
    try {
        if (files.length === 0) return
        const images = files.filter((file) => file.fileType === "image").map(file => file.public_id)
        const videos = files.filter((file) => file.fileType === "video").map(file => file.public_id)
        const raws = files.filter((file) => file.fileType === "raw").map(file => file.public_id)

        if (images.length > 0) await cloudinary.api.delete_resources(images, {resource_type: "image"});
        if (videos.length > 0) await cloudinary.api.delete_resources(videos, {resource_type: "video"});
        if (raws.length > 0) await cloudinary.api.delete_resources(raws, {resource_type: "raw"});
    } catch (error) {
        console.error("Error deleting media:", error);
    }
}

const fileFormat = (filename, extension) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];

    if (imageExtensions.includes(extension)) {
        return 'image';
    } else if (videoExtensions.includes(extension)) {
        return 'video';
    } else if (audioExtensions.includes(extension)) {
        return 'raw'; // Changed from potentially 'audio' to 'raw'
    } else {
        return 'raw'; // All other file types including PDFs should use 'raw'
    }
};

const uploadToCloudinary = async (files = []) => {
    if (files.length === 0) return [];
    const uploadPromises = files.map((file) => {
        const fileExtension = file.originalname.split(".").pop().toLowerCase();
        const fileType = fileFormat(file.originalname, fileExtension);
        const publicId = `${uuid()}-${file.originalname}`;
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: process.env.CLOUDINARY_FOLDER,
                resource_type: fileType,
                public_id: publicId,
                ...(fileType !== 'raw' && {format: fileExtension})
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    });
    try {
        const results = await Promise.all(uploadPromises);
        return results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
    } catch (error) {
        console.error('Error uploading files to Cloudinary:', error);
        throw error;
    }
}

const emitEvent = (req, event, users, data) => {
    const io = req.app.get("io")
    const userSockets = getSockets(users);
    io.to(userSockets).emit(event, data);
}

module.exports = {
    connectDB,
    sendToken,
    emitEvent,
    deleteFilesFromCloudinary,
    cookieOptions,
    uploadToCloudinary,
    getMyFriends,
    clearCookieOptions
}