const express = require('express');
const router = express.Router();
const catchAsync = require('../Utils/catchAsync');
const {createUser, loginUser, logout} = require('../Controllers/authController');
const { singleFileUpload } = require('../Middlewares/multer');
const {isAuthenticated} = require('../Middlewares/auth'); 

router.route('/signup').post(singleFileUpload, catchAsync(createUser));
router.route('/login').post(catchAsync(loginUser));
router.route('/logout').post(isAuthenticated, catchAsync(logout));

module.exports = router;