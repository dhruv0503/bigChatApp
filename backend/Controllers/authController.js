const User = require('../Models/userModel.js');
const expressError = require('../Utils/expressError.js');
const { sendToken } = require('../Utils/features.js')

const createUser = async (req, res, next) => {
    const { name, username, password, avatar, bio } = req.body;
    return res.send({avatar, files : req.files})
    const user = new User({ name, username, password, avatar, bio });
    if (!user) return next(new expressError('User not created', 400));
    const createdUser = await user.save();
    sendToken(res, createdUser, 201, "Sign Up Successful");

}

const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new expressError('Incorrect Username or Password', 400));
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new expressError('Incorrect Username or Password', 400));
    sendToken(res, user, 200, `Welcome Back ${user.name}`);
}

const logout = async(req, res, next) => {
    res.clearCookie('jsonToken');
    res.status(200).json({
        status : true,
        message : "Logged Out Successfully"
    });
}

module.exports = {createUser, loginUser, logout}