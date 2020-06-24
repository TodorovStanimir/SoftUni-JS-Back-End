const userControllers = require('../controllers/userControllers');
const articleControllers = require('../controllers/articleControllers');
const express = require('express');
const checkAuth = express.Router();
checkAuth.use(userControllers.isLogged, userControllers.addToken, userControllers.ensureToken);

module.exports = (app) => {

    app.get('/', checkAuth, articleControllers.getAll);

    app.route('/login')
        .get(userControllers.getLogin)
        .post(userControllers.postLogin, userControllers.setCookie);

    app.get('/logout', userControllers.getLogout);

    app.route('/register')
        .get(userControllers.getRegister)
        .post(userControllers.postRegister)

    app.get('/details/:id', checkAuth, articleControllers.getDetails)

    app.route('/edit/:id')
        .get(checkAuth, articleControllers.getEdit)
        .post(checkAuth, articleControllers.postEdit)

    app.get('/delete/:id', checkAuth, articleControllers.getDelete)

    app.route('/create')
        .get(checkAuth, articleControllers.getCreate)
        .post(checkAuth, articleControllers.postCreate)
};