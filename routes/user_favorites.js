const express = require('express');
const router = express.Router();
const db = require('./../db');

//Get one user's favorite food items
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT * FROM User_Favorite WHERE user_id = ?;`;
    db.query(sql, [userId], (error, results, fields) => {
        if (error) return console.error(error.message);
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

//Check if user has specific food item as favorite
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

module.exports = router;