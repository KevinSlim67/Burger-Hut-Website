const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home_page/home.html');
});

router.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home_page/home.html');
});

router.get('/cart', (req, res) => {
    res.sendFile(__dirname + '/public/cart_page/cart.html');
});

router.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact_page/contact.html');
});

router.get('/favorite', (req, res) => {
    res.sendFile(__dirname + '/public/favorite_page/favorite.html');
});

router.get('/order', (req, res) => {
    res.sendFile(__dirname + '/public/order_page/order.html');
});

router.get('/order-history', (req, res) => {
    res.sendFile(__dirname + '/public/order_history_page/order_history.html');
});

router.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/public/profile_page/profile.html');
});

router.get('/sign-in', (req, res) => {
    res.sendFile(__dirname + '/public/sign_in_page/sign_in.html');
});

router.get('/sign-up', (req, res) => {
    res.sendFile(__dirname + '/public/sign_in_page/sign_up.html');
});

router.get('/driver/sign-in', (req, res) => {
    res.sendFile(__dirname + '/public/driver/sign_in_page/sign_in.html');
});

router.get('/driver/orders', (req, res) => {
    res.sendFile(__dirname + '/public/driver/orders_page/orders.html');
});

router.get('/driver/orders-to-deliver', (req, res) => {
    res.sendFile(__dirname + '/public/driver/orders_to_deliver_page/orders.html');
});

module.exports = router;