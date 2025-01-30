const jwt = require('jsonwebtoken');
const expressError = require('../Utils/expressError');

const isAuthenticated = (req, res, next) => {
    if (req.cookies.jsonToken) {
        const user = jwt.verify(req.cookies.jsonToken, process.env.JWT_SECRET);
        console.log(user)
        req.userId = user._id;
        next();
    } else {
        next(new expressError('Please Login First', 401));
    }
}

const isAdmin = (req, res, next) => {
    if(req.cookies.adminToken){
        const secretKey = jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET);
        if(secretKey !== process.env.ADMIN_SECRET_KEY){
            next(new expressError('Invalid Admin Token', 401));
        }
        next();   
    } else{
        next(new expressError('This route is only accessible by Admins', 401));
    }
}

module.exports = { isAuthenticated, isAdmin }