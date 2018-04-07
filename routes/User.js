const express = require('express');

const User = require('../controllers/UserController');

const router = express.Router();

router.route('/user/me').patch(User.PATCH_INFO);

module.exports = router;
