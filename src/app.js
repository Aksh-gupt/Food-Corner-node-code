const express = require('express')
require('./db/mongoose');
const userRouter = require('./routes/user')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')
const ratingRouter = require('./routes/rating')
const clickRouter = require('./routes/click')
const monthRouter = require('./routes/month')

const app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', "*");
    next();
}

app.use(express.json());
app.use(allowCrossDomain);

app.use(userRouter)
app.use(cartRouter)
app.use(orderRouter)
app.use(ratingRouter)
app.use(clickRouter)
app.use(monthRouter)

module.exports = app