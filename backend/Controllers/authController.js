const User = require('../Models/userModel.js');
const expressError = require('../Utils/expressError.js');
const { sendToken, uploadToCloudinary } = require('../Utils/features.js')

module.exports.createUser = async (req, res, next) => {
    const { name, username, password, bio } = req.body;
    const file = req.file;
    if (!file) return next(new expressError('Please uplaod avatar', 400));
    const result = await uploadToCloudinary([file]);
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url
    }
    // console.log(avatar)

    const user = new User({ name, username, password, avatar, bio });
    if (!user) return next(new expressError('User not created', 400));
    const createdUser = await user.save();
    sendToken(res, createdUser, 201, "Sign Up Successful");

}

module.exports.loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new expressError('Incorrect Username or Password', 400));
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new expressError('Incorrect Username or Password', 400));
    sendToken(res, user, 200, `Welcome Back ${user.name}`);
}

module.exports.logout = async (req, res, next) => {
    res.clearCookie('jsonToken');
    res.status(200).json({
        status: true,
        message: "Logged Out Successfully"
    });
}

// module.exports.imageUploadTest = async(req, res, next) =>{
//     const file = req.file;
//     if(!file) return next(new expressError('No file uploaded', 400));
//     console.log(file)
//     res.send({file})
// }
