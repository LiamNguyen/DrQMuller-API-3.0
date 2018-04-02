const express = require('express');

const Docs = require('../controllers/RamlController');

const router = express.Router();

router.route('/docs').get(Docs.GET);

module.exports = router;
