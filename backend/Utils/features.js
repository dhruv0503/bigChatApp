const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const streamifier = require('streamifier')
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
    })
}

const deleteFilesFromCloudinary = async (pubic_ids) => {

}

const uploadToCloudinary = async (files = []) => {
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
    // console.log("Emitting Event")
}

module.exports = { connectDB, sendToken, emitEvent, deleteFilesFromCloudinary, cookieOptions, uploadToCloudinary }