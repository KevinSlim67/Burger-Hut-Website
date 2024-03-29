require('dotenv').config();
const mysql = require('mysql');

//connect to sql database
const { HOST, USER, PASSWORD, DATABASE } = process.env;

const db = mysql.createPool({
    connectionLimit: 20,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
});


module.exports = db;