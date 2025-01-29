const express = require('express');
const catchAsync = require('../Utils/catchAsync');
const { getUsers } = require('../Controllers/adminController');
const router = express.Router();

router.route('/users').get(catchAsync(getUsers))

module.exports = router;