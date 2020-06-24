const userControllers = require('../controllers/userControllers');
const articleControllers = require('../controllers/articleControllers');
const utils = require('../utils')


module.exports = (app) => {

    app.route('/')
        .get(utils.auth(), articleControllers.getAll);

    app.route('/login')
        .get(utils.guard(), userControllers.getLogin)
        .post(utils.guard(), userControllers.postLogin);

    app.route('/logout')
        .get(userControllers.getLogout);

    app.route('/register')
        .get(utils.guard(), userControllers.getRegister)
        .post(utils.guard(), userControllers.postRegister)

    app.route('/details/:id')
        .get(utils.auth(), articleControllers.getDetails)

    app.route('/edit/:id')
        .get(utils.auth(), articleControllers.getEdit)
        .post(utils.auth(), articleControllers.postEdit)

    app.get('/delete/:id', utils.auth(), articleControllers.getDelete)

    app.route('/create')
        .get(utils.auth(), articleControllers.getCreate)
        .post(utils.auth(), articleControllers.postCreate)

    app.route('*')
        .get(function (req, res, next) { res.redirect('/') })
};