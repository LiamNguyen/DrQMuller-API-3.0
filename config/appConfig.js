require('dotenv').config();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const express = require('express');
const cors = require('cors');
const requestMiddleware = require('../middlewares/RequestMiddleware');
const server = require('../server');

module.exports = app => {
  const { rootDirectory } = server;

  app.use(cors());
  app.use(bodyParser.json());
  app.use(fileUpload());
  app.use('/public', express.static(`${rootDirectory}/public`));
  requestMiddleware(app);
};
