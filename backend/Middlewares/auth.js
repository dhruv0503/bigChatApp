const jwt = require('jsonwebtoken');
const expressError = require('../Utils/expressError');

const isAuthenticated = (req, res, next) => {
    if (req.cookies.jsonToken) {
        const user = jwt.verify(req.cookies.jsonToken, process.env.JWT_SECRET);
        req.userId = user._id;
        next();
    } else {
        console.log(req.cookies);
        next(new expressError('Please Login First', 401));
    }
}

const isAdmin = (req, res, next) => {
    if(req.cookies.adminToken){
        const adminToken = jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET);
        if(adminToken !== process.env.ADMIN_SECRET_KEY){
            next(new expressError('This route is only accessible by Admins', 401));
        }
        next();   
    } else{
        next(new expressError('This route is only accessible by Admins', 401));
    }
}

module.exports = { isAuthenticated, isAdmin }