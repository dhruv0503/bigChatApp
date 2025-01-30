const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

const deleteFilesFromCloudinary = async(pubic_ids) => {

}

const emitEvent = (req, event, users, data) => {
    // console.log("Emitting Event")
}

module.exports = { connectDB, sendToken,emitEvent, deleteFilesFromCloudinary, cookieOptions}