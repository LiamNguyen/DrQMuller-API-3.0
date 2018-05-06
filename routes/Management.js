const express = require('express');

const Management = require('../controllers/ManagementController');

const router = express.Router();

router
  .route('/management/appointments')
  .get(Management.GET_NEWLY_CREATED_APPOINTMENT);

module.exports = router;
