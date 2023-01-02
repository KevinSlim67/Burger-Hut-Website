const express = require('express');
const request = require('request');
const router = express.Router();
const db = require('./../db');
const { companyToClientMail } = require('./email');
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
            res.json({ status: 'SUCCESS' });
        }
    });
});

//Adds food items to order
router.post('/add-food', async (req, res) => {
    const { orderId, cart, email } = req.body;
    const foods = cart.map(c => [orderId, c.id, c.amount]);

    const sql = `INSERT INTO Order_Food (order_id, food_id, amount) VALUES ?`;
    db.query(sql, [foods], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            const sql = `SELECT * FROM \`Order\` WHERE id = ?;`;
            db.query(sql, [orderId], (error, results, fields) => {
                if (error) {
                    console.error(error.message);
                } else {
                    const order = results[0];
                    let emailTemp = '';
                    emailTemp = emailTemplate(order, 'Thank you for placing an order with Burger Hut. Your order is being prepared and will be ready for pickup soon.');
                    companyToClientMail({ subject: `Order Confirmation - ${orderId}`, html: emailTemp }, email);
                    res.json({ status: 'SUCCESS' });
                }
            });
        }
    });
});

//Get user's last 10 orders
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT \`Order\`.*, first_name, last_name FROM \`Order\` LEFT JOIN Driver ON driver_id = Driver.id WHERE user_id = ? ORDER BY ordered_date DESC LIMIT 10;`;
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

//Get all orders of a specific branch who's status are 'In Progress'
router.get('/:branchId/toDeliver', async (req, res) => {
    const branchId = req.params.branchId;

    const sql = `SELECT \`Order\`.id, ordered_date, \`Order\`.phone_number, total_price, first_name, last_name,
     Address.district, Address.city, Branch.city AS branch, street_name, building_name, floor_number, room_number,
     landmark, company_name, Address.additional_information FROM \`Order\`
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

//Get an all orders of a specific branch who's status are 'In Transit'
router.get('/:branchId/InTransit', async (req, res) => {
    const driverId = req.params.branchId;

    const sql = `SELECT \`Order\`.id, ordered_date, \`Order\`.phone_number, total_price, first_name, last_name,
     Address.district, Address.city, Branch.city AS branch, street_name, building_name, floor_number, room_number,
     landmark, company_name, Address.additional_information FROM \`Order\`
     JOIN Branch ON branch_id = Branch.id
     JOIN User ON user_id = User.id
     JOIN Address ON Address.id = address_id
     WHERE driver_id = ? AND status = 'In Transit'`;
    db.query(sql, [driverId], (error, results, fields) => {
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
    const { orderId, status, driverId, deliveredDate} = req.body;
    let sql = `UPDATE \`Order\` SET status = ?, driver_id = ?, delivered_date = ? WHERE id = ?`;
    db.query(sql, [status, driverId, deliveredDate, orderId], (error, results, fields) => {
        if (error) {
            res.json({ status: 'ERROR' });
            console.error(error.message);
        } else {
            const sql = `SELECT \`Order\`.*, email FROM \`Order\` JOIN User ON User.id = \`Order\`.user_id WHERE \`Order\`.id = ?;`;
            db.query(sql, [orderId], (error, results, fields) => {
                if (error) {
                    console.error(error.message);
                } else {
                    const order = results[0];
                    let emailTemp = '';
                    switch (status) {
                        case 'Delivered':
                            emailTemp = emailTemplate(order, 'Your order has been set as delivered. If you think this is a mistake, please contact us.');
                            companyToClientMail({ subject: `Order Successfully Delivered - ${order.id}`, html: emailTemp }, order.email);
                            break;
                        case 'In Transit':
                            emailTemp = emailTemplate(order, 'Thank you for placing an order with Burger Hut. Your order is now done, and is currently on its way to be delivered to you.');
                            companyToClientMail({ subject: `Order In Transit - ${order.id}`, html: emailTemp }, order.email);
                            break;
                        case 'Cancelled':
                            emailTemp = emailTemplate(order, 'Thank you for placing an order with Burger Hut. It seems your driver decided to cancel your order. We sincerely apologize for the trouble, if you wish to order again, either call us or order using our website.');
                            companyToClientMail({ subject: `Order Cancelled - ${order.id}`, html: emailTemp }, order.email);
                            break;
                    }
                }
            });

        }
        res.json({ status: 'SUCCESS' });
    });
});

function emailTemplate(order, description) {
    const list = [];
    for (const key in order) {
        if (!key.includes('_id') && order[key] !== null && key !== 'email') {
            //format the element accordingly
            let capitalKey = key.charAt(0).toUpperCase() + key.slice(1);
            capitalKey = capitalKey.replace('_', ' ');

            if (capitalKey === 'Id') capitalKey = 'Order Id';
            if (key === 'total_price') order[key] = order[key] + '$';
            if (key === 'estimated_time') order[key] = order[key] + ' minutes';

            list.push(`<li><strong>${capitalKey}:</strong> ${order[key]}</li>`);
        }
    }

    return `
    <p>Dear Customer,</p>
    <p>${description}</p>
    <h3>Order Details:</h3>
    <ul>
       ${list.join('')}
    </ul>
    <p>Thank you for choosing Burger Hut.</p>
    <p>Best regards,</p>
    <p>The Burger Hut Team</p>`;
}

module.exports = router;