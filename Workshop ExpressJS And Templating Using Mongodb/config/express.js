const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
// const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const secret = 'secret';


module.exports = (app) => {
    app.use(cookieParser(secret));
    //TODO: Setup the view engine
    app.engine('.hbs', expressHandlebars({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        extname: '.hbs',
        // defaultLayout: false,
        // layoutsDir: path.resolve(path.dirname(__dirname), 'views'),
        defaultLayout: 'main',
    }));
    app.set('view engine', '.hbs');

    //TODO: Setup the body parser
    app.use(express.urlencoded({ extended: false }));

    //TODO: Setup the static files
    app.use(express.static(path.resolve(path.dirname(__dirname), './static')));

};