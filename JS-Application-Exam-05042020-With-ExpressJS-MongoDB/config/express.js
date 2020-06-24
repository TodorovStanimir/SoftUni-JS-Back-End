const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSecret = 'secret';

module.exports = (app) => {

    //TODO: Setup the view engine
    app.engine('.hbs', expressHandlebars({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        extname: '.hbs',
        defaultLayout: 'main',
        // layoutsDir: path.resolve(path.dirname(__dirname), 'views')
    }));
    app.set('view engine', '.hbs');

    //TODO: Setup the body parser
    app.use(bodyParser.urlencoded({ extended: false }));

    //TODO: Setup the static files
    app.use(express.static(path.resolve(path.dirname(__dirname), './static')));

    app.use(cookieParser(cookieSecret));
};