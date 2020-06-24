const express = require('express');
const cookieParser = require('cookie-parser');
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

module.exports = (app) => {
  app.engine('hbs', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: 'views',
    defaultLayout: 'main-layout',
    partialsDir: 'views/partials',
    extname: '.hbs',
    helpers: {
      moment: function (content, options) {
        return options.fn(content.toString().split(' ').slice(0, 5).join(' '));
      }
    }
  }));

  app.set('view engine', 'hbs');

  app.use(express.static('./static'));

  app.use(cookieParser());

  app.use(express.urlencoded({ extended: false }));
}