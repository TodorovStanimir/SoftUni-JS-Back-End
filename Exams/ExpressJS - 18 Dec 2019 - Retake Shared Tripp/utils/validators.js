const { body } = require('express-validator');

const tripValidator = [
    body('startAndEndPoint')
        .custom((value, { req }) => {
            if (!/^[\w\W\s\S]{4,} - [\w\W\s\S]{4,}$/gi.test(value)) {
                throw new Error(`The Starting Point - End Point - Starting and End point should be at least 4 characters long (each) and should be separated with single space, dash and another single space (" - ")`);
            }
            return true;
        })
    ,
    body('dateTime')
        .custom((value, { req }) => {
            if (!/^[\w\W\s\S]{6,} - [\w\W\s\S]{6,}$/gi.test(value)) {
                throw new Error(`The Date - Time - Date and Time should be at least 6 characters long (each) and should be separated with single space, dash and another single space (" - ")`);
            }
            return true;
        })
    ,
    body('carImage')
        .custom((value, { req }) => {
            if (!/^(https:\/\/|http:\/\/){1}[\w\W]+$/gi.test(value)) {
                throw new Error(`The CarImage - should be actual link refering to the car image.`);
            }
            return true;
        })
    ,
    body('seats')
        .isNumeric({ min: 1 }).withMessage('The Seats should be positive number.')
    ,
    body('description')
        .isLength({ min: 10 }).withMessage(`The description should be minimum 10 characters long.`)
];

const userValidator = [

    body('email')
        .isEmail().withMessage('The email should be in the following format (mailboxname @ domainname) -  "username@domain.bg"')
    ,

    body('password')
        .isLength({ min: 6 }).withMessage('The password should be at least 6 characters long')
    ,

    body('rePassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('The repeat password should be equal to the password');
            }
            return true;
        })
];

module.exports = {
    tripValidator,
    userValidator
};