const jwt = require('jsonwebtoken');
const expressError = require('../utils/expressError');

const isAuthenticated = (req, res, next) => {
    if (req.cookies.jsonToken) {
        const user = jwt.verify(req.cookies.jsonToken, process.env.JWT_SECRET);
        req.userId = user._id;
        next();
    } else {
        next(new expressError('Please Login First', 401));
    }
}

module.exports = { isAuthenticated }