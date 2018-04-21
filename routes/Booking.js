const express = require('express');

const Booking = require('../controllers/BookingController');

const router = express.Router();

router.route('/availableTime').get(Booking.GET_AVAILABLE_TIME);
router.route('/appointment').post(Booking.CREATE_APPOINTMENT);

module.exports = router;
