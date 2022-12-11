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

//Get user's cart food items
router.post('/cart', async (req, res) => {
    const { userId } = req.body;

    const sql = `SELECT * FROM CART c JOIN Food f ON c.food_id = f.id WHERE user_id = ?`;
    db.query(sql, [userId], (error, results, fields) => {
        if (error) console.log(error.code);
        results.forEach(r => {
            //send image if it exists, send placeholder image if not
            const imagePath = r.image;
            try {
                if (imagePath !== null || fs.existsSync(imagePath)) {
                    r.image = fs.readFileSync(imagePath, 'base64');
                } else {
                    r.image = fs.readFileSync('assets/food/placeholder.png', 'base64');
                }
            } catch (err) {
                console.error(err)
            }
        })
        res.send(results);
    });
});

module.exports = router;