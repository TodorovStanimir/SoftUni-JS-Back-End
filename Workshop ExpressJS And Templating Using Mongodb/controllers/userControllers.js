const { userModel, tokenBlackListModel } = require('../models');
const jwt = require('../utils/jwt');
const appConfig = require('../app-config');

module.exports = {
    get: {
        register: function (req, res, next) {
            res.render('register.hbs');
        },
        login: function (req, res, next) {
            res.render('login.hbs');
        },
        logout: function (req, res) {
            const token = req.cookies[appConfig.authCookieName];
            tokenBlackListModel.create({ token }).then(() => {
                res.clearCookie(appConfig.authCookieName).redirect('/');
            })
        }
    },
    post: {
        register: function (req, res, next) {
            const newUser = { ...req.body };

            if (newUser.password !== newUser.repeatPassword) {
                const errors = {
                    repeatPassword: {
                        message: 'Password and repeat password don\'t mach'
                    }
                }
                res.render('register.hbs', {
                    newUser,
                    errors
                });
                return;
            }
            return userModel.create({ ...newUser }).then(() => {
                res.redirect('/login');
            }).catch(err => {
                if (err.name = 'ValidationError') {
                    res.render('register.hbs', {
                        newUser,
                        errors: err.errors
                    });
                    return
                }
                next(err);
            });
        },
        login: function (req, res, next) {
            const { username, password } = req.body;
            userModel.findOne({ username })
                .then(user => Promise.all([user, user ? user.matchPassword(password) : false]))
                .then(([user, match]) => {
                    if (!match) {
                        const errors = {
                            password: {
                                message: 'Wrong password or username!'
                            }
                        }
                        res.render('login.hbs', {
                            username, password, errors
                        });
                        return;
                    }
                    // if (!match) {
                    //     res.render('500.hbs', { errorMessage: 'Wrong password or username' });
                    //     return;
                    // }
                    const token = jwt.createToken({ id: user._id });
                    res.cookie(appConfig.authCookieName, token).redirect('/')
                })
                .catch(err => next(err))
        }
    }
}
