const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./db');

db.connect(function (err) {
    if (err) throw err;
    console.log("SQL Database Connected");
});

app.use(cors()); //allows communication between server and frontend
app.use(express.json()); //allow express server to use json
app.use(express.urlencoded()) //decodes data sent from HTML form

//set up / route
app.get('/', async (req, res) => {
    try {
        res.json('Route / Handled');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const addressesRouter = require('./routes/addresses');
app.use('/addresses', addressesRouter);

const foodsRouter = require('./routes/foods');
app.use('/foods', foodsRouter);

const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

const contactRouter = require('./routes/contact');
app.use('/contact', contactRouter);

const userFavorites = require('./routes/user_favorites');
app.use('/users-favorites', userFavorites);

//start the sever
app.listen(process.env.PORT || 5000, () => console.log("Server Started"));

module.exports = { db };

