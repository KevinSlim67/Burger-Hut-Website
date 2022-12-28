const express = require('express');
const router = express.Router();
const db = require('../db');


//add address to user's account
router.post('/add', async (req, res) => {
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

//Gets all user's addresses
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT * FROM Address WHERE user_id = ?`;
    db.query(sql, [userId], (error, results, fields) => {
        if (error) {
            console.log(res.json({ status: 'ERROR', message: error.message }));
        }
        res.json(results);
    });
});

//Delete a user's address;
router.delete('/delete', async (req, res) => {
    const { id } = req.body;
    const sql = `DELETE FROM Address WHERE id = ?`;
    db.query(sql, [id], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            return console.error(error.message);
        } else res.json({ status: 'SUCCESS' });
    });
});

//Edit addresse's info
router.patch('/edit', async (req, res) => {
    let { address, id } = req.body;

    const arr = [];
    for (const a in address) {
        if (a === 'id') continue
        if (address[a] === '') address[a] = null;
        if (address[a] !== null) arr.push(`${a} = '${address[a]}'`);
    }
    const sets = arr.join(', ');
    const sql = `UPDATE Address SET ${sets} WHERE id = ?;`;

    db.query(sql, [id], (error, results, fields) => {
        if (error) {
            res.send({ status: 'ERROR', message: error.message });
            console.error(error.message);
        } else {
            res.send({ status: 'SUCCESS' });
        }
    });
});


module.exports = router;