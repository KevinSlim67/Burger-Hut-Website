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



module.exports = router;