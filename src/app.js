'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: false 
}));

// Coectando com o banco
mongoose.connect(
    config.connectionString,
    { useNewUrlParser: true });

// Carrega os models
const ProductModel = require('./models/product-model');
const CustomerModel = require('./models/customer-model');
const OrderModel = require('./models/order-model');

// Carrega as rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);

module.exports = app;