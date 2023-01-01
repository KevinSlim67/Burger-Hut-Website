const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./db');
const { generateRoutes } = require('./routes');
const { companyToClientMail } = require('./routes/email');

db.connect(function (err) {
    if (err) throw err;
    console.log("SQL Database Connected");
});

app.use(cors()); //allows communication between server and frontend
app.use(express.json()); //allow express server to use json
app.use(express.urlencoded()) //decodes data sent from HTML form

//set up / route
app.get('/', async (req, res) => {
    try {
        res.json('Route / Handled');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

generateRoutes(app); //generate DB-related routes

//start the sever
app.listen(process.env.PORT || 5000, () => console.log("Server Started"));

module.exports = { db };

