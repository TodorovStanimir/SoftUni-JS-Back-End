const { userModel, tokenBlackListModel } = require('../models');
const jwt = require('../utils/jwt');
const appConfig = require('../app-config');

function getLogin(req, res) {
    res.render('login');
}

function postLogin(req, res, next) {
    const { email, password } = req.body;

    userModel.findOne({ email })
        .then(user => Promise.all([user, user.matchPassword(password)]))
        .then(([user, match]) => {
            if (!match) {
                res.render('login.hbs', { error: { message: 'Wrong password or username' } });
                return;
            }
            const token = jwt.createToken({ id: user._id });
            res.cookie(appConfig.authCookieName, token).redirect('/')
        })

}

function getRegister(req, res) {
    res.render('register');
}

function postRegister(req, res, next) {
    const { email, password, 'rep-pass': repeatPassword } = { ...req.body };
    if (password !== repeatPassword) {
        res.render('register.hbs', {
            email,
            password,
            error: {
                repeatPassword: 'Repeat pasword don\'t match password!'
            }
        });
        return;
    }
    return userModel.create({ email, password }).then(() => {
        res.redirect('/login');
    }).catch(error => {
        if (error.name = 'MongoError' && error.code === 11000) {
            res.render('register.hbs', {
                password,
                repeatPassword,
                error: {
                    email: 'Email already taken!'
                }
            });
            return
        }
        next(error);
    })


}

function getLogout(req, res) {
    const token = req.cookies[appConfig.authCookieName];
    tokenBlackListModel.create({ token }).then(() => {
        res.clearCookie(appConfig.authCookieName).redirect('/');
    })
}

module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getRegister,
    postRegister,
}