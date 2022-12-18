const express = require('express');
const router = express.Router();
const db = require('./../db');

//Adds an order submitted by one user
router.post('/add', async (req, res) => {
    const { id, userId, branchId, addressId, phoneNumber, totalPrice, estimatedTime, orderedDate } = req.body;
    const sql = `INSERT INTO \`Order\` (id, user_id, branch_id, address_id, phone_number, total_price, estimated_time, status, ordered_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [id, userId, branchId, addressId, phoneNumber, totalPrice, estimatedTime, 'In Process', orderedDate], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
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



module.exports = router;