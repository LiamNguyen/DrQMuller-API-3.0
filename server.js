const express = require('express');
const fs = require('fs');
const https = require('https');

const database = require('./database');
const appConfig = require('./config/appConfig');
const routes = require('./routes');

const sslkey = fs.readFileSync('./certificates/ssl-key.pem');
const sslcert = fs.readFileSync('./certificates/ssl-cert.pem');

const options = { key: sslkey, cert: sslcert };

const app = express();

module.exports.rootDirectory = __dirname;
database.connect();
appConfig(app);
routes(app);

module.exports.server = https.createServer(options, app).listen(5000);
if (process.env.NODE_ENV === 'development') {
  console.log('Listening on port 5000...');
}
