const { validationResult } = require('express-validator');

const { User, TokenBlackList } = require('../models');
const { jwt } = require('../utils');
const config = require('../config/config');

module.exports = {

    get: {
        login: function (req, res, next) {
            const hbsObject = {
                pageTitle: 'Login Page'
            }
            res.render('login.hbs', hbsObject);
        },

        register: function (req, res, next) {
            const hbsObject = {
                pageTitle: 'Register Page'
            }
            res.render('register.hbs', hbsObject);
        },
        logout: function (req, res) {
            const token = req.cookies[config.cookieSecret];

            TokenBlackList.create({ token }).then(() => {
                res.clearCookie(config.cookieSecret).clearCookie('email').redirect('/');
            });
        },
    },

    post: {
        login: async function (req, res, next) {
            const { email, password } = req.body;

            try {
                const user = await User.findOne({ email });
                const match = user ? await user.matchPassword(password) : false;

                if (!match) {
                    const errors = {
                        message: 'Wrong password or username!'
                    };

                    res.render('login.hbs', { email, password, errors });
                    return;
                };
                const token = jwt.createToken({ id: user._id, email: user.email });

                res.cookie('email', user.email);
                res.cookie(config.cookieSecret, token, { maxAge: 3600000 }).redirect('/shared-tripps');
            } catch (err) {
                next(err);
            }
        },

        register: async function (req, res, next) {
            const { email, password, rePassword } = req.body;

            const errors = validationResult(req);

            console.log(errors)

            if (!errors.isEmpty()) {

                const hbsObject = {
                    pageTitle: 'Register Page',
                    email, password, rePassword,
                    errors: [errors.array()[0].msg]
                };
                return res.render('register.hbs', hbsObject)
            }

            if (password !== rePassword) {
                const errors = {
                    message: "The repeat password should be equal to the password"
                };
                return res.render('register.hbs', { email, password, rePassword, errors, pageTitle: 'Register Page' });
            }

            try {
                const registeredUser = await User.create({ email, password });

                res.redirect('/user/login');
            } catch (err) {

                if (err.name === 'ValidationError') {

                    const hbsObject = {
                        email,
                        password,
                        rePassword,
                        errors: err.errors
                    };

                    return res.render('register.hbs', hbsObject);
                };

                if (err.name === 'MongoError') {

                    const hbsObject = {
                        email,
                        password,
                        rePassword,
                        errors: [`User ${err.keyValue.email} is taken.`]
                    };

                    return res.render('register.hbs', hbsObject);
                };

                next(err);
            }
        },
    },
}