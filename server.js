const express = require('express');
const fs = require('fs');
const https = require('https');

const database = require('./database');
const serverConfig = require('./config/serverConfig');
const routes = require('./routes');
const SocketIO = require('./SocketIO');

const sslkey = fs.readFileSync('./certificates/ssl-key.pem');
const sslcert = fs.readFileSync('./certificates/ssl-cert.pem');

const options = { key: sslkey, cert: sslcert };

const app = express();

module.exports.rootDirectory = __dirname;
database.connect();
serverConfig(app);
routes(app);

let server;

if (process.env.NODE_ENV === 'test') {
  server = app.listen(8081);
} else {
  server = https.createServer(options, app).listen(5000);
  if (process.env.NODE_ENV === 'development') {
    // Serve at this port only for raml specs
    app.listen(8080);
    console.log('Project is running at https://localhost:5000');
  }
}

SocketIO.init(server);

module.exports.server = server;
