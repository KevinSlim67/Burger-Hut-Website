const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');

//Get all foods
router.get('/', async (req, res) => {
    const sql = `SELECT * FROM Food`;
    db.query(sql, (error, results, fields) => {
        if (error) return console.error(error.message);

        res.json(results);
    });
});

router.get('/:category', async (req, res) => {
    const category = req.params.category;
    const sql = `SELECT Food.*, ingredient FROM Food LEFT JOIN Food_Ingredient ON Food.id = Food_Ingredient.food_id WHERE category = ?`;
    db.query(sql, [category], (error, results, fields) => {
        if (error) return console.error(error.message);

        const foods = {};
        results.forEach(r => {
            if (!foods[r.id]) {
                foods[r.id] = {
                    ingredients: []
                }
                for (let key in r) {
                    if (key !== "ingredient") {
                        foods[r.id][key] = r[key];
                    }
                }
                //send image if it exists, send placeholder image if not
                const imagePath = r.image;
                try {
                    if (imagePath !== null || fs.existsSync(imagePath)) {
                        foods[r.id].image = fs.readFileSync(imagePath, 'base64');
                    } else {
                        foods[r.id].image = fs.readFileSync('assets/food/placeholder.png', 'base64');
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            if(r.ingredient) foods[r.id].ingredients.push(r.ingredient);
        });
        res.json(Object.values(foods));
    });
});

//Get food based on letters that it contains
router.get('/search/:input', async (req, res) => {
    const input = req.params.input;
    const sql = `SELECT * FROM Food WHERE name LIKE ?`;
    db.query(sql, [`%${input}%`], (error, results, fields) => {
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

//Get food using its id
router.get('/id/:id', async (req, res) => {
    const id = req.params.id;
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

//Get food ingredients
router.get('/:id/ingredients', async (req, res) => {
    const id = req.params.id;
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