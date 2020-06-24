const express = require('express')
const router = express.Router();

const { auth } = require('../utils');
const controllers = require('../controllers');
const { expenseValidator } = require('../utils/validators');

router.get('/', auth(false), controllers.expense.get.home);

router.get('/expenses', auth(), controllers.expense.get.expenses);

router.route('/addExpense')
    .get(auth(), controllers.expense.get.addExpense)
    .post(auth(), expenseValidator, controllers.expense.post.addExpense);

router.route('/report/:id')
    .get(auth(), controllers.expense.get.report)

router.get('/stopTracking/:id', auth(), controllers.expense.get.stopTracking);

router.get('*', auth(false), controllers.expense.get.notFound);

module.exports = router;