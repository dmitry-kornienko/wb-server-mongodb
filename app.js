const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))


const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', require('./routes/users'));
app.use('/api/component', require('./routes/components'));
app.use('/api/complect', require('./routes/complects'));
app.use('/api/buy-operation', require('./routes/buy-operations'));
app.use('/api/packed-operation', require('./routes/packed-operations'));
app.use('/api/send-operation', require('./routes/send-operations'));

module.exports = app;
