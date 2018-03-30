const express = require('express');
const database = require('./database');
const appConfig = require('./config/appConfig');
const routes = require('./routes');

const app = express();

module.exports.rootDirectory = __dirname;
database.connect();
appConfig(app);
routes(app);

app.listen(5000);
console.log('Listening on port 5000...');
