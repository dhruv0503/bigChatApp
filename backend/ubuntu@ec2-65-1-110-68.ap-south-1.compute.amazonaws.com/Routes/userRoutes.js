const express = require('express');
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');
const router = express.Router();
const { getMyProfile, searchUser, myFriends, getMyNotifications, myOnlineFriends } = require('../Controllers/userController');

router.route('/profile').get(isAuthenticated, catchAsync(getMyProfile));
router.route('/search').get(isAuthenticated, catchAsync(searchUser));
router.route('/friends').get(isAuthenticated, catchAsync(myFriends))
router.route('/notifications').get(isAuthenticated, catchAsync(getMyNotifications))
router.route('/friends/online').get(isAuthenticated, catchAsync(myOnlineFriends))

module.exports = router;