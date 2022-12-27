const express = require('express');
const router = express.Router();
const db = require('./../db');
const fs = require('fs');


//Get one user's favorite food items
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT * FROM User_Favorite JOIN Food ON User_Favorite.food_id = Food.id WHERE User_Favorite.user_id = ?;`;
    db.query(sql, [userId], (error, results, fields) => {
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

//Check if user has specific food item as favorite
router.get('/:userId/:foodId', async (req, res) => {
    const userId = req.params.userId;
    const foodId = req.params.foodId;
    const sql = `SELECT EXISTS (SELECT 1 FROM User_Favorite WHERE user_id = ? AND food_id = ?) AS result;`;
    db.query(sql, [userId, foodId], (error, results, fields) => {
        if (error) return console.error(error.message);
        if (results[0]['result'] == 1) res.json(true)
        else res.json(false);
    });
});

//Delete item for user's favorite items
router.delete('/delete', async (req, res) => {
    const { userId, foodId } = req.body;
    const sql = `DELETE FROM User_Favorite WHERE user_id = ? AND food_id = ?`;
    db.query(sql, [userId, foodId], (error, results, fields) => {
        if (error) {
            console.error(error.message);
            res.json({ status: 'ERROR', message: error.message });
        } else {
            res.json({ status: 'SUCCESS' });
        }
    });
});

//Add item to user's favorite items
router.post('/add', async (req, res) => {
    const { userId, foodId } = req.body;
    const sql = `INSERT INTO User_Favorite (user_id, food_id) VALUES (?, ?)`;
    db.query(sql, [userId, foodId], (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') res.send({ status: 'DUPLICATE' });
            else console.error(error.message);
        } else {
            res.send({ status: 'SUCCESS' });
        }
    });
});

module.exports = router;