const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./db');
const { generateRoutes } = require('./routes');
const path = require('path');


app.use(express.json()); //allow express server to use json
app.use(express.urlencoded()) //decodes data sent from HTML form

app.use('/', express.static(path.join(__dirname, 'public')));

generateRoutes(app);

//start the sever
app.listen(process.env.PORT || 5000, () => console.log("Server Started"));

module.exports = { db };

