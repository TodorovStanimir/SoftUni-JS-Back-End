const { validationResult } = require('express-validator');
const { Expense, User } = require('../models');
const { renderCategory } = require('../utils')

module.exports = {

    get: {
        home: async function (req, res, next) {
            if (res.locals.isLoggedIn) {
                res.redirect('/expenses')
            } else {
                res.render('home.hbs');
            }

        },
        expenses: async function (req, res, next) {
            const userId = req.user.id;
            try {
                const expenses = await Expense.find({ user: userId }).lean();

                const hbsObject = {
                    expenses
                };
                res.render('expenses.hbs', hbsObject);
            } catch (error) {
                res.render('404', error);
            }
        },
        addExpense: function (req, res, next) {

            res.render('new-expense.hbs');
        },
        report: async function (req, res, next) {
            try {
                const expenseId = req.params.id;
                const userId = req.user._id;

                const expense = await Expense.findById(expenseId).lean();

                const hbsObject = {
                    expense
                }
                res.render('report.hbs', expense);
            } catch (error) {
                res.render('404', { error })
            }

        },
        stopTracking: async function (req, res, next) {
            try {
                const expenseId = req.params.id;
                const userId = req.user._id;

                const deletedExpense = await Expense.findByIdAndDelete(expenseId);
                await User.findByIdAndUpdate({ _id: userId }, { $pull: { expenses: expenseId } });
                res.redirect('/expenses');
            } catch (error) {
                res.render('404', { error });
            }
        },
        error: function (req, res, next) {

            res.render('404.hbs');
        },
        notFound: function (req, res, next) {

            res.render('404.hbs');
        }
    },

    post: {
        addExpense: async function (req, res, next) {
            try {
                const { merchant, description, category } = req.body;
                const total = Number(req.body.total);
                const report = req.body.report === 'on';
                const userId = req.user._id;

                const errors = validationResult(req);
                console.log(errors)

                if (!errors.isEmpty()) {

                    const hbsObject = {
                        merchant, description, category, total, report,
                        htmlCategory: renderCategory(category),
                        errors: [errors.array()[0].msg]
                    };
                    return res.render('new-expense.hbs', hbsObject)
                }

                const newExpense = new Expense({ merchant, description, category, total, report, user: userId });
                const expenseId = newExpense._id;

                await newExpense.save();

                const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { expenses: expenseId } })
                res.redirect('/expenses');
            } catch (error) {
                res.render('404', { error });
            }
        },
    }
}