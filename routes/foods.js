const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');

//Returns all foods
router.get('/', async (req, res) => {
    const sql = `SELECT * FROM Food`;
    db.query(sql, (error, results, fields) => {
        if (error) return console.error(error.message);

        res.json(results);
    });
});

//Returns food with specific category
router.post('/category', async (req, res) => {
    const category = req.body.category;
    const sql = `SELECT * FROM Food WHERE category = ?`;
    db.query(sql, [category], (error, results, fields) => {
        if (error) return console.error(error.message);
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
        });
        res.json(results);
    });
});

//Returns food ingredients
router.post('/ingredients', async (req, res) => {
    const id = req.body.id;
    const sql = `SELECT ingredient FROM Food_Ingredient WHERE food_id = ?`;
    const items = [];
    db.query(sql, [id], (error, results, fields) => {
        if (error) return console.error(error.message);
        for (let i = 0; i < results.length; i++) {
            items.push(results[i].ingredient);
        }
        res.json(items);
    });
});


//Add item to cart if it doesn't exist, if it does, update the amount instead
router.post('/add-to-cart', async (req, res) => {
    const { userId, foodId, amount } = req.body;
    const sql = `INSERT INTO Cart (user_id, food_id, amount) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE amount = amount + ?;`;

    db.query(sql, [userId, foodId, amount, amount], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({ status: 'ERROR' });
        } else {
            res.json(results);
        }
    });
});


//Remove one item from cart
router.post('/cart-remove-one', async (req, res) => {
    const { userId, foodId } = req.body;
    const sql = `UPDATE Cart SET amount = amount - 1 WHERE user_id = ? AND food_id = ?;`;
    
    db.query(sql, [userId, foodId], (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DATA_OUT_OF_RANGE') {
                deleteItemAt0();
            } else {
                console.log(error);
                res.send({ status: 'ERROR' });
            }
        } else {
            deleteItemAt0();
            res.send({ status: 'SUCCESS' });
        }
    });
});

//Remove one item from cart
router.post('/cart-remove-all', async (req, res) => {
    const { userId, foodId } = req.body;
    const sql = `DELETE FROM Cart WHERE user_id = ? AND food_id = ?;`;
    db.query(sql, [userId, foodId], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({ status: 'ERROR' });
        } else {
            res.send({ status: 'SUCCESS' });
        }
    });
});

function deleteItemAt0() {
    //If the the amount of an item reaches 0, delete it from cart
    const sql2 = `DELETE FROM Cart WHERE amount = 0;`
    db.query(sql2, [], (error, results, fields) => {
        if (error) console.log(error);;
    });
}

module.exports = router;