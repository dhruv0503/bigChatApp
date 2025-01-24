const User = require('../Models/userModel.js')

const getMyProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);
    res.status(200).json({
        success: true,
        user
    })
}

// module.exports.searchUser = async (req, res, next) => {
//     const { name } = req.query;
//     const users = await User.find({ name: { $regex: name, $options: "i" } });
//     res.status(200).json({
//         success: true,
//         users
//     })
// }

module.exports = {getMyProfile}