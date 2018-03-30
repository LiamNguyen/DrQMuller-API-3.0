const express = require('express');

const Auth = require('../controllers/AuthController');

const router = express.Router();

router.route('/user').post(Auth.POST);

module.exports = router;
