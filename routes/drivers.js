const express = require('express');
const router = express.Router();
const db = require('./../db');

//Authenticates user
router.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        const sql = `SELECT * FROM Driver WHERE email = ? AND password = ?`;
        db.query(sql, [email, password], (error, results, fields) => {
            if (error) console.log(error.code);

            if (results.length > 0) {
                res.send({ id: results[0].id, firstName: results[0].first_name, branchId: results[0].branch_id, status: 'FOUND' });
            } else {
                res.send({ status: 'NOT FOUND' });
            }
        });
    }
});

module.exports = router;