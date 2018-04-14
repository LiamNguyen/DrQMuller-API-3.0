const express = require('express');

const Auth = require('../controllers/AuthController');

const router = express.Router();

router.route('/user').post(Auth.POST_CREATE);
router.route('/signin').post(Auth.POST_SIGNIN);
router.route('/signout').post(Auth.POST_SIGNOUT);
router.route('/resetPasswordRequest').post(Auth.POST_RESET_PASSWORD_REQUEST);
router.route('/resetPasswordConfirm').patch(Auth.PATCH_RESET_PASSWORD_CONFIRM);

module.exports = router;
