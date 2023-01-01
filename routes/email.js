const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

//Send email to notify user that their order was received
router.post('/received', async (req, res) => {
    const { userId, firstName } = req.body;
});



async function companyToClientMail(email) {
    const { subject, html } = email;
    // create a nodemailer transport object
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: 'burgerhut1212@gmail.com',
            pass: process.env.BURGER_COMPANY
        }
    });

    // send the email
    let info = await transporter.sendMail({
        from: 'Burger Hut <burgerhut1212@gmail.com>',
        to: 'sappeur67@gmail.com',
        subject: subject,
        html: html
    });

    console.log(`Message sent: ${info.messageId}`);
}

module.exports = { router, companyToClientMail };