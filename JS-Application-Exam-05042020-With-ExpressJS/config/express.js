const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

module.exports = (app) => {

    //TODO: Setup the view engine
    app.engine('.hbs', handlebars({
        extname: '.hbs',
        defaultLayout: 'main',
        // layoutsDir: path.resolve(path.dirname(__dirname), 'views')
    }));
    app.set('view engine', '.hbs');

    //TODO: Setup the body parser
    app.use(bodyParser.urlencoded({ extended: false }));

    //TODO: Setup the static files
    app.use(express.static(path.resolve(path.dirname(__dirname), './static')));

    app.use(cookieParser());
};