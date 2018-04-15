const express = require('express');

const Booking = require('../controllers/BookingController');

const router = express.Router();

router.route('/availableTime').get(Booking.GET_AVAILABLE_TIME);

module.exports = router;
