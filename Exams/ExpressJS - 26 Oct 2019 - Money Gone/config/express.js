const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const moment = require('moment');

const { getUserStatus } = require('../utils');

module.exports = (app) => {
    app.engine('hbs', handlebars({
        extname: '.hbs',
        helpers: {
            // moment: function (content, options) {
            //     return options.fn(content.toString().split(' ').slice(1, 3).join(' '));
            // },
            // moments: function (content, options) {
            //     const output = content.toString().split(' ').slice(1, 3).join(' ') + ', ' + content.toString().split(' ').slice(3, 4).join(' ');
            //     return options.fn(output);
            // },
            moment: function (date, format) {
                return moment(date).format(format);
            }
        }
    }));
    app.set('view engine', 'hbs');

    app.use(express.static(path.join(__dirname, '../', '/static')));

    app.use(cookieParser());

    app.use(express.urlencoded({ extended: false }));

    app.use(getUserStatus);
}