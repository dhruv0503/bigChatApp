const express = require('express');
const router = express.Router();
const { newGroupChat } = require('../Controllers/chatController');
const {isAuthenticated} = require('../Middlewares/auth');
const catchAsync = require('../utils/catchAsync');

router.route('/group/new').post(isAuthenticated, catchAsync(newGroupChat))

module.exports = router;