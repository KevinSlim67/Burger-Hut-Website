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
        results.map(r => {
            const imagePath = r.image;
 
                try {
                    if (imagePath !== null || fs.existsSync(imagePath)) {
                        r.image = fs.readFileSync(imagePath, 'base64');
                    } else {
                        r.image = fs.readFileSync('assets/food/placeholder.png', 'base64');
                    }
                  } catch(err) {
                    console.error(err)
                  }
            
        })

        res.json(results);
    });
});

module.exports = router;