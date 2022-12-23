const express = require('express');
const router = express.Router();

module.exports = router;

//Send email
router.post('/', async (req, res) => {
    const output = `
    Here's an email. Does it work ?
    `;
});