const express = require('express');
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');
const router = express.Router();
const {getMyProfile, searchUser} = require('../Controllers/userController');

router.route('/profile').get(isAuthenticated, catchAsync(getMyProfile)); 
// router.route('/search').get(isAuthenticated, catchAsync(searchUser)); 

module.exports = router;