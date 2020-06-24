const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const handlebars = require('express-handlebars');

const { getUserStatus } = require('../utils');

module.exports = (app) => {
    app.engine('hbs', handlebars({ extname: '.hbs' }));
    app.set('view engine', 'hbs');

    app.use(express.static(path.join(__dirname, '../', '/static')));

    app.use(cookieParser());

    app.use(express.urlencoded({ extended: false }));

    app.use(getUserStatus);
}