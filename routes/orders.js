const express = require('express');
const request = require('request');
const router = express.Router();
const db = require('./../db');
require('dotenv').config();

//Adds an order submitted by one user
router.post('/add', async (req, res) => {
    const { id, userId, branchId, addressId, phoneNumber, specialInstructions, totalPrice, estimatedTime, orderedDate, captcha } = req.body;
    
    if (captcha === null || captcha === undefined || captcha === '') {
        res.json({ status: 'FAILED', message: "Please validate captcha" });
        return;
    }

    //verify captcha
    const remoteIP = req.socket.remoteAddress;
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_CAPTCHA}&response=${captcha}&remoteip=${remoteIP}`;
    request(verifyURL, (err, response, body) => {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            res.json({ status: 'FAILED', message: "Failed captcha verification" });
            return;
        }
    });

    const sql = `INSERT INTO \`Order\` (id, user_id, branch_id, address_id, phone_number, total_price, estimated_time, status, ordered_date, special_instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [id, userId, branchId, addressId, phoneNumber, totalPrice, estimatedTime, 'In Progress', orderedDate, specialInstructions], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR', message: error.message });
        } else {
            res.json({ status: 'SUCCESS', orderId: results[0] });
        }
    });
});

//Adds food items to order
router.post('/add-food', async (req, res) => {
    const { orderId, cart } = req.body;
    const foods = cart.map(c => [orderId, c.id, c.amount]);

    const sql = `INSERT INTO Order_Food (order_id, food_id, amount) VALUES ?`;
    db.query(sql, [foods], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            res.json({ status: 'SUCCESS' });
        }
    });
});

//Get user's last 10 orders
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT * FROM \`Order\` WHERE user_id = ? ORDER BY ordered_date DESC LIMIT 10;`;
    db.query(sql, [userId], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            res.json(results);
        }
    });
});

//Get an order's food items
router.get('/food/:id', async (req, res) => {
    const id = req.params.id;

    const sql = `SELECT name, amount FROM Order_Food JOIN Food ON food_id = Food.id WHERE order_id = ?;`;
    db.query(sql, [id], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            res.json(results);
        }
    });
});

//Get an all orders of a specific branch who's status are 'In Progress'
router.get('/:branchId/toDeliver', async (req, res) => {
    const branchId = req.params.branchId;

    const sql = `SELECT \`Order\`.id, ordered_date, \`Order\`.phone_number, total_price, first_name, last_name,
     Address.district, Address.city, street_name, building_name, floor_number, room_number, landmark, company_name, additional_information FROM \`Order\`
     JOIN Branch ON branch_id = Branch.id
     JOIN User ON user_id = User.id
     JOIN Address ON Address.id = address_id
     WHERE branch_id = ? AND status = 'In Progress'`;
    db.query(sql, [branchId], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            res.json(results);
        }
    });
});

//Change Order Status
router.patch('/status', async (req, res) => {
    const {orderId, status, driverId} = req.body;

    const sql = `UPDATE \`Order\` SET status = ?, driver_id = ? WHERE id = ?`;
    db.query(sql, [status, driverId, orderId], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            res.json({ status: 'SUCCESS' });
        }
    });
});

module.exports = router;