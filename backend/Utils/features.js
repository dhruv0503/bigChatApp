const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const streamifier = require('streamifier')
const { getSockets } = require('./helper')
const cloudinary = require('cloudinary').v2

const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
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
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("jsonToken", token, cookieOptions)
    return res.status(code).json({
        success: true,
        message: msg,
        user
    })
}

const deleteFilesFromCloudinary = async (files) => {
    try {
        if (files.length === 0) return
        const images = files.filter((file) => file.fileType === "image").map(file => file.public_id)
        const videos = files.filter((file) => file.fileType === "video").map(file => file.public_id)
        const raws = files.filter((file) => file.fileType === "raw").map(file => file.public_id)

        if (images.length > 0) await cloudinary.api.delete_resources(images, { resource_type: "image" });
        if (videos.length > 0) await cloudinary.api.delete_resources(videos, { resource_type: "video" });
        if (raws.length > 0) await cloudinary.api.delete_resources(raws, { resource_type: "raw" });
    } catch (error) {
        console.error("Error deleting media:", error);
    }
}

const uploadToCloudinary = async (files = []) => {
    if (files.length === 0) return [];
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: process.env.CLOUDINARY_FOLDER,
                resource_type: 'auto',
                public_id: uuid()
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
        const formattedResults = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));
        return formattedResults;
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

module.exports = { connectDB, sendToken, emitEvent, deleteFilesFromCloudinary, cookieOptions, uploadToCloudinary }