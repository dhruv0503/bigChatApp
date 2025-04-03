const express = require('express');
const router = express.Router();
const { sendAttachment, getMessages } = require("../Controllers/messageController")
const { isAuthenticated } = require('../Middlewares/auth');
const catchAsync = require('../Utils/catchAsync');
const { attachmentUpload } = require('../Middlewares/multer')
const { sendAttachmentValidator, validateHandler, chatIdValidator } = require('../Utils/validators')

router.route('/attachment').post(isAuthenticated, attachmentUpload, sendAttachmentValidator(), validateHandler, catchAsync(sendAttachment));
router.route('/:id').get(isAuthenticated, chatIdValidator(), validateHandler, catchAsync(getMessages));

module.exports = router;