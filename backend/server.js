const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const userRoute = require('./route.js/userRoute');
const productRoute = require('./route.js/productRoute');
const orderRoute = require('./route.js/orderRoute');
const historyRoute = require('./route.js/historyRoute');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/history', historyRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
