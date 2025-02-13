const jwt = require('jsonwebtoken');
const expressError = require('../Utils/expressError');
const User = require('../Models/userModel')

const isAuthenticated = (req, res, next) => {
    if (req.cookies.jsonToken) {
        const user = jwt.verify(req.cookies.jsonToken, process.env.JWT_SECRET);
        req.userId = user._id;
        next();
    } else {
        next(new expressError('Please Login First', 401));
    }
}

const isAdmin = (req, res, next) => {
    if (req.cookies.adminToken) {
        const adminToken = jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET);
        if (adminToken !== process.env.ADMIN_SECRET_KEY) {
            next(new expressError('This route is only accessible by Admins', 401));
        }
        next();
    } else {
        next(new expressError('This route is only accessible by Admins', 401));
    }
}

const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) return next(err)

        const authToken = socket.request.cookies.jsonToken

        if (!authToken) return next(new expressError('Please Login First', 401))

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET)
        const user = await User.findById(decodedData._id)

        if (!user) return next(new expressError('Please Login First', 401))

        socket.user = user;
        return next();
        
    } catch (error) {
        console.log(error);
        return next(new expressError('Please Login First', 401))
    }
}

module.exports = { isAuthenticated, isAdmin, socketAuthenticator }