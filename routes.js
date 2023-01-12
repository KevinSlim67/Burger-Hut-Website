function generateRoutes(app) {
    const pagesRouter = require('./pages');
    app.use('/', pagesRouter);

    const usersRouter = require('./routes/users');
    app.use('/users', usersRouter);

    const driversRouter = require('./routes/drivers');
    app.use('/drivers', driversRouter);

    const addressesRouter = require('./routes/addresses');
    app.use('/addresses', addressesRouter);

    const foodsRouter = require('./routes/foods');
    app.use('/foods', foodsRouter);

    const ordersRouter = require('./routes/orders');
    app.use('/orders', ordersRouter);

    const userFavoritesRouter = require('./routes/user_favorites');
    app.use('/users-favorites', userFavoritesRouter);

    const emailRouter = require('./routes/email').router;
    app.use('/email', emailRouter);
}

module.exports = { generateRoutes };