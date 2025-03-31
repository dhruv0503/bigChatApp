const { body, validationResult, param } = require('express-validator');
const expressError = require('./expressError');

module.exports.registerValidator = () => [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("bio").trim().notEmpty().withMessage("Bio is required"),
    body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")

];

module.exports.loginValidator = () => [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
];

module.exports.newGroupValidator = () => [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("members").notEmpty().withMessage("Members are required").isArray({ min: 2, max: 100 }).withMessage("Members must be between 2 and 100"),
];

module.exports.addMemberValidator = () => [
    body("chatId").notEmpty().withMessage("Chat ID is required"),
    body("newMembers").notEmpty().withMessage("Members are required").isArray({ min: 1, max: 97 }).withMessage("At least one member is required"),
];

module.exports.removeMemberValidator = () => [
    body("chatId").notEmpty().withMessage("Chat ID is required"),
    body("userId").notEmpty().withMessage("User ID is required"),
];


module.exports.renameGroupValidator = () => [
    param("chatId").notEmpty().withMessage("Chat ID is required"),
    body("name").trim().notEmpty().withMessage("Name is required"),
];

module.exports.chatIdValidator = () => [
    param("id").notEmpty().withMessage("Chat ID is required"),
];

module.exports.sendAttachmentValidator = () => [
    body("chatId").notEmpty().withMessage("Chat ID is required"),
];

module.exports.sendRequestValidator = () => [
    body("userId").notEmpty().withMessage("User ID is required"),
];

module.exports.acceptRequestValidator = () =>
    [
        body("requestId").notEmpty().withMessage("Request ID is required"),
        body("accept").notEmpty().withMessage("Accept is required").isBoolean().withMessage("Accept must be a boolean")
    ]

module.exports.adminLoginValidator = () => [
    body("secretKey").notEmpty().withMessage("A Secret Key is required")
]


module.exports.validateHandler = (req, res, next) => {
    const errors = validationResult(req);
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    if (!errors.isEmpty()) {
        next(new expressError(errorMessages, 400))
    }
    next();
};


