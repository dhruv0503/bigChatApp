const express = require('express');
const router = express.Router();
const { newGroupChat, getMyChat, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachment, getChatDetails, renameGroup, deleteChat } = require('../Controllers/chatController');
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');
const { newGroupValidator, addMemberValidator, removeMemberValidator, renameGroupValidator, chatIdValidator, validateHandler } = require('../Utils/validators')

router.route('/group/leave/:id').patch(isAuthenticated, chatIdValidator(), validateHandler, catchAsync(leaveGroup))

router.route('/group/new').post(isAuthenticated, newGroupValidator(), validateHandler, catchAsync(newGroupChat))
router.route('/group/add').patch(isAuthenticated, addMemberValidator(), validateHandler, catchAsync(addMembers));
router.route('/group/remove').patch(isAuthenticated, removeMemberValidator(), validateHandler, catchAsync(removeMember))

router.route('/group').get(isAuthenticated, catchAsync(getMyGroups));

router.route('/:chatId')
    .get(isAuthenticated, catchAsync(getChatDetails))
    .patch(isAuthenticated, renameGroupValidator(), validateHandler, catchAsync(renameGroup))
    
router.route('/:id').delete(isAuthenticated, chatIdValidator(), validateHandler, catchAsync(deleteChat));

router.route('/').get(isAuthenticated, catchAsync(getMyChat));

module.exports = router;