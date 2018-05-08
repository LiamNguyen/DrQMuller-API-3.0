const express = require('express');

const database = require('./database');
const serverConfig = require('./config/serverConfig');
const routes = require('./routes');
const SocketIO = require('./SocketIO');

const app = express();

module.exports.rootDirectory = __dirname;
database.connect();
serverConfig(app);
routes(app);

let server;

if (process.env.NODE_ENV === 'test') {
  server = app.listen(8081);
} else {
  server = app.listen(process.env.PORT || 5000);
  if (process.env.NODE_ENV === 'development') {
    // Serve at this port only for raml specs
    app.listen(8080);
    console.log('Project is running at https://localhost:5000');
  }
}

SocketIO.init(server);

module.exports.server = server;
