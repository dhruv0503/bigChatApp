const express = require('express');
const catchAsync = require('../Utils/catchAsync');
const { getUsers, allChats, allMessages, getDashboardStats, adminLogin, adminLogout, getAdminLogin } = require('../Controllers/adminController');
const router = express.Router();
const { validateHandler, adminLoginValidator } = require("../Utils/validators")
const { isAdmin } = require('../Middlewares/auth');

router.route('/').get(isAdmin, catchAsync(getAdminLogin));
router.route('/login').post(adminLoginValidator(), validateHandler, catchAsync(adminLogin));
router.route('/logout').post(isAdmin, catchAsync(adminLogout));
router.route('/users').get(isAdmin, catchAsync(getUsers));
router.route('/chats').get(isAdmin, catchAsync(allChats));
router.route('/messages').get(isAdmin, catchAsync(allMessages));
router.route('/dashboard').get(isAdmin, catchAsync(getDashboardStats));

module.exports = router;