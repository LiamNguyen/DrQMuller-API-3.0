const express = require('express');

const Booking = require('../controllers/BookingController');

const router = express.Router();

router.route('/availableTime').get(Booking.GET_AVAILABLE_TIME);
router.route('/appointment').post(Booking.CREATE_APPOINTMENT);
router.route('/appointments').get(Booking.GET_APPOINTMENTS_BY_LOGIN_TOKEN);

module.exports = router;
