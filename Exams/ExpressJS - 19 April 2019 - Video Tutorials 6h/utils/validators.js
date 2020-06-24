const { body } = require('express-validator');

const courseValidator = [

    body('description', `The description should bemaximum 50 characters long`)
        .isLength({ max: 50 })
    ,
    body('imageUrl')
        .custom((value, { req }) => {
            const pattern = /^(https:\/\/|http:\/\/){1}[\w\W]+$/gi;
            if (!pattern.test(value)) {
                throw new Error(`The imageUrl- should be actual link refering to the course image`);
            };
            return true;
        })
];

const userValidator = [
    body('repeatPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('The repeat password should be equal to the password');
            }
            return true;
        })
];

module.exports = {
    courseValidator,
    userValidator
};
