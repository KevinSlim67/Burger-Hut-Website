const express = require('express');
const router = express.Router();
const db = require('./../db');
const fs = require('fs');

//Returns all users
router.get('/', async (req, res) => {
    const sql = `SELECT * FROM User`;
    db.query(sql, (error, results, fields) => {
        if (error) return console.error(error.message);

        res.json(results);
    });
});

//Authenticates user
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const sql = `SELECT * FROM User WHERE email = ? AND password = ?`;
        db.query(sql, [email, password], (error, results, fields) => {
            if (error) console.log(error.code);

            if (results.length > 0) {
                res.send({ id: results[0].id, firstName: results[0].first_name, status: 'FOUND' });
            } else {
                res.send({ status: 'NOT FOUND' });
            }
        });
    }
});

//Register user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, gender, phone, countryCode, dob } = req.body;
    if (email && password) {
        const sql = `INSERT INTO User (first_name, last_name, email, password, gender, phone_number, country_code, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [firstName, lastName, email, password, gender, phone, countryCode, dob], (error, results, fields) => {

            if (error) {
                if (error.code === 'ER_DUP_ENTRY') res.send({ status: 'DUPLICATE' });
                else console.error(error.message);
            } else {
                res.send({ status: 'SUCCESS' });
            }
        });
    }
});

//add address to user's account
router.post('/add-address', async (req, res) => {
    let { name, userId, district, city, streetName, buildingName, floorNumber, roomNumber, landmark, companyName, additionalInfo } = req.body;
    if (companyName === '') companyName = null;
    if (landmark === '') landmark = null;
    if (additionalInfo === '') additionalInfo = null;
    const sql = `INSERT INTO Address (name, user_id, district, city, street_name, building_name, floor_number, room_number, landmark, company_name, additional_information)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, userId, district, city, streetName, buildingName, floorNumber, roomNumber, landmark, companyName, additionalInfo], (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') res.send({ status: 'DUPLICATE' });
            else console.error(error.message);
        } else {
            res.send({ status: 'SUCCESS' });
        }
    });
});

//Returns all user's addresses
router.post('/get-addresses', async (req, res) => {
    const { userId } = req.body;
    const sql = `SELECT * FROM Address WHERE user_id = ?`;
    db.query(sql, [userId], (error, results, fields) => {
        if (error) return console.error(error.message);
        res.json(results);
    });
});

router.delete('/delete-address', async (req, res) => {
    const { userId, name } = req.body;
    const sql = `DELETE FROM Address WHERE (user_id = ? AND name = ?)`;
    db.query(sql, [userId, name + ''], (error, results, fields) => {
        if (error){
            res.json({status: 'ERROR'});
            return console.error(error.message);
        } else res.json({status: 'SUCCESS'});
    });
});


module.exports = router;