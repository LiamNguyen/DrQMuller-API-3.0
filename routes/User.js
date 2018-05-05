const express = require('express');

const User = require('../controllers/UserController');

const router = express.Router();

router.route('/user/me').get(User.GET_INFO);
router.route('/user/me').patch(User.PATCH_INFO);

module.exports = router;
