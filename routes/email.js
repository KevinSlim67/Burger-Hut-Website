const express = require('express');
const router = express.Router();
require('dotenv').config();
const nodemailer = require('nodemailer');

async function companyToClientMail(email, clientEmail) {
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
        to: clientEmail,
        subject: subject,
        html: html
    });
}

async function clientToCompanyMail(email, clientEmail, clientName) {
    const { subject, text } = email;
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
        from: `${clientEmail}`,
        to: 'burgerhut1212@gmail.com',
        subject: subject,
        text: text
    });
}

//Authenticates user
router.post('/send-to-company', async (req, res) => {
    const { email, username, emailType, message } = req.body;
    clientToCompanyMail({ subject: `${emailType} - ${username}`, text: message }, email, username);
    res.json({ status: 'SUCCESS' });
});

module.exports = { router, companyToClientMail, clientToCompanyMail };