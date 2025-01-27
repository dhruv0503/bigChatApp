const express = require('express');
const router = express.Router();
const { newGroupChat, getMyChat, getMyGroups, addMembers, removeMember, leaveGroup } = require('../Controllers/chatController');
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');

router.route('/group/leave/:id').patch(isAuthenticated, catchAsync(leaveGroup))
router.route('/group/new').post(isAuthenticated, catchAsync(newGroupChat))
router.route('/group/add').patch(isAuthenticated, catchAsync(addMembers));
router.route('/group/remove').patch(isAuthenticated, catchAsync(removeMember))
router.route('/group').get(isAuthenticated, catchAsync(getMyGroups));
router.route('/').get(isAuthenticated, catchAsync(getMyChat));

module.exports = router;