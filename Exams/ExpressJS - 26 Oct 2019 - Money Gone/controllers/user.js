const { validationResult } = require('express-validator');

const { User, TokenBlackList } = require('../models');
const { jwt } = require('../utils');
const config = require('../config/config');

module.exports = {

    get: {
        login: function (req, res, next) {
            res.render('login.hbs');
        },

        register: function (req, res, next) {
            res.render('register.hbs');
        },
        logout: function (req, res) {
            const token = req.cookies[config.cookieSecret];

            TokenBlackList.create({ token }).then(() => {
                res.clearCookie(config.cookieSecret).clearCookie('userusername').redirect('/');
            });
        },
        accountInfo: async function (req, res, next) {
            const userId = req.user._id;
            try {
                const user = await User.findById(userId).populate('expenses').lean();

                const totalExpenses = user.expenses.reduce((acc, exp) => acc += exp.total, 0).toFixed(2);
                const availableAmount = (user.amount - totalExpenses).toFixed(2);
                const totalMerchant = user.expenses.length;
                res.render('account-info.hbs', { totalExpenses, availableAmount, totalMerchant })
            } catch (error) {
                next(error);
            }
        }
    },

    post: {
        login: async function (req, res, next) {
            const { username, password } = req.body;

            try {
                const user = await User.findOne({ username });
                const match = user ? await user.matchPassword(password) : false;

                if (!match) {
                    const errors = {
                        message: 'Wrong password or username!'
                    };

                    res.render('login.hbs', { username, password, errors });
                    return;
                };
                const token = jwt.createToken({ id: user._id, username: user.username });

                res.cookie('username', user.username);
                res.cookie(config.cookieSecret, token, { maxAge: 3600000 }).redirect('/expenses');
            } catch (err) {
                next(err);
            }
        },

        register: async function (req, res, next) {
            const { username, password, repeatPassword } = req.body;
            const amount = +req.body.amount;

            const errors = validationResult(req);

            console.log(errors)

            if (!errors.isEmpty()) {

                const hbsObject = {
                    username, password, repeatPassword, amount,
                    errors: [errors.array()[0].msg]
                };
                return res.render('register.hbs', hbsObject)
            }

            if (password !== repeatPassword) {
                const errors = {
                    message: "The repeat password should be equal to the password"
                };
                return res.render('register.hbs', { username, password, repeatPassword, amount, errors });
            }

            try {
                const registeredUser = await User.create({ username, password, amount });

                res.redirect('/login');
            } catch (err) {

                if (err.name === 'ValidationError') {

                    const hbsObject = {
                        username,
                        password,
                        repeatPassword,
                        amount,
                        errors: err.errors
                    };

                    return res.render('register.hbs', hbsObject);
                };

                if (err.name === 'MongoError') {

                    const hbsObject = {
                        username,
                        password,
                        repeatPassword,
                        amount,
                        errors: [`User ${err.keyValue.username} is taken.`]
                    };

                    return res.render('register.hbs', hbsObject);
                };

                next(err);
            }
        },
        refill: async function (req, res, next) {
            const userId = req.user._id;
            try {
                const amount = Number(req.body['refill-amount']);

                await User.findByIdAndUpdate(userId, { $inc: { amount: amount } });

                res.redirect('/expenses');

            } catch (err) {
                next(err);
            }
        }
    },
}