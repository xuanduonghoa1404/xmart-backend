const subscriberRouter = require('./subscribers');
const authRouter = require('./auth');
const locatorRouter = require('./locator');
const productRouter = require('./product');
const productsRouter = require('./products');
const userRouter = require('./user');
const orderRouter = require('./order');
const inventoryRouter = require('./inventory');
const typeRouter = require('./type');
const marketingRouter = require('./marketing');
// const uploadRouter = require('./upload');
const shopRouter = require('./shop');
const importInventory = require('./importInventory');
const exportInventory = require('./exportInventory');
const statistic = require('./statistic');
//Index of route middleware
const route = (app) => {
    //Route middleware subscribers
    app.use('/subscribers', subscriberRouter);

    //Route middleware auth
    app.use('/api/auth', authRouter);
    app.use('/api', locatorRouter);
    app.use('/api', productRouter);
    app.use('/api', productsRouter);
    app.use('/api', userRouter);
    app.use('/api', orderRouter);
    app.use('/api', inventoryRouter);
    app.use('/api', typeRouter);
    app.use('/api', marketingRouter);
    app.use('/api', shopRouter);
    app.use('/api', importInventory);
    app.use('/api', exportInventory);
    app.use('/api', statistic);
    // app.use('/api', uploadRouter);
};

module.exports = route;
