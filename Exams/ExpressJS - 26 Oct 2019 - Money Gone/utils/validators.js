const { body } = require('express-validator');

const expenseValidator = [
    body('merchant')
        .isLength({ min: 4 }).withMessage('The merchant should be at least 4 characters long')
    // .custom((value, { req }) => {
    //     if (!/^[\w\W\s\S]{4,} - [\w\W\s\S]{4,}$/gi.test(value)) {
    //         throw new Error(`The Starting Point - End Point - Starting and End point should be at least 4 characters long (each) and should be separated with single space, dash and another single space (" - ")`);
    //     }
    //     return true;
    // })
    ,
    body('total')
        .isFloat({ min: 0.01 }).withMessage(`The total should be positive number`)
    // .custom((value, { req }) => {
    //     if (!/^[\w\W\s\S]{6,} - [\w\W\s\S]{6,}$/gi.test(value)) {
    //         throw new Error(`The Starting Point - End Point - Starting and End point should be at least 4 characters long (each) and should be separated with single space, dash and another single space (" - ")`);
    //     }
    //     return true;
    // })
    ,
    body('description')
        .isLength({ min: 10, max: 50 }).withMessage(`The description should be minimum 10 characters long and 50 characters maximum`)
    ,
    body('category')
        .custom((value, { req }) => {
            const category = ["advertising", "benefits", "car", "equipment",
                "fees", "home-office", "insurance", "interest", "Labor",
                "maintenance", "materials", "meals-and-entertainment", "office-supplies",
                "other", "professional-services", "rent", "taxes", "travel", "utilities"];
            if (!category.includes(value)) {
                throw new Error(`The category is not correct`);
            }
            return true;
        })
];

const userValidator = [

    body('username')
        .isLength({ min: 4 }).withMessage('The username should be at least 4 characters long')
    ,
    body('username')
        .custom((value, { req }) => {
            if (!/^[a-zA-Z0-9]+$/gi.test(value)) {
                throw new Error('The username should consist only english letters and digits');
            }
            return true;
        })
    ,

    body('password')
        .isLength({ min: 8 }).withMessage('The password should be at least 8 characters long')
    ,

    body('repeatPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('The repeat password should be equal to the password');
            }
            return true;
        })
    ,
    body('amount')
        .isFloat({ min: 0.00 }).withMessage('The account amount should be positive number')
    ,
];

module.exports = {
    expenseValidator,
    userValidator
};