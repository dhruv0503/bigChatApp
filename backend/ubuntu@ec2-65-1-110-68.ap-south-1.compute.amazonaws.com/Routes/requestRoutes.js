const express = require('express');
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');
const { sendFriendRequest, acceptFriendRequest } = require('../Controllers/requestController');
const { sendRequestValidator, validateHandler, acceptRequestValidator } = require('../Utils/validators');
const router = express.Router();

router.route('/')
    .post(isAuthenticated, sendRequestValidator(), validateHandler, catchAsync(sendFriendRequest))
    .patch(isAuthenticated, acceptRequestValidator(), validateHandler, catchAsync(acceptFriendRequest))

module.exports = router;