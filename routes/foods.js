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

//Returns food using its id
router.post('/id', async (req, res) => {
    const id = req.body.id;
    const sql = `SELECT * FROM Food WHERE id = ?`;
    db.query(sql, [id], (error, results, fields) => {
        if (error) return console.error(error.message);
        if (results[0] !== undefined) {
            //send image if it exists, send placeholder image if not
            const imagePath = results[0].image;
            try {
                if (imagePath !== null || fs.existsSync(imagePath)) {
                    results[0].image = fs.readFileSync(imagePath, 'base64');
                } else {
                    results[0].image = fs.readFileSync('assets/food/placeholder.png', 'base64');
                }
            } catch (err) {
                console.error(err)
            }
            res.json(results[0]);
        } else {
            res.json([]);
        }
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


module.exports = router;