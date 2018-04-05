const express = require('express');

const User = require('../controllers/UserController');

const router = express.Router();

router.route('/user/me').put(User.PUT_INFO);

module.exports = router;
