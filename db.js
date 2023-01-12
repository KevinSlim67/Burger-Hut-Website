require('dotenv').config();
const mysql = require('mysql');

//connect to sql database
const { HOST, USER, PASSWORD, DATABASE } = process.env;

const db = mysql.createPool({
    connectionLimit: 10,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
});


module.exports = db;