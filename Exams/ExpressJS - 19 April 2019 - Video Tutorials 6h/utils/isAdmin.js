const jwt = require('./jwt');
const config = require('../config/config');

const isAdmin = async function (req, res, next) {
    try {
        const token = req.cookies[config.cookieSecret] || '';
        const decodetToken = jwt.verifyToken(token);

        if (decodetToken.role !== 'Admin') {
            res.redirect('/all-courses');
            return;
        }
        next();
    } catch (error) {

        next(error);
    }
}

module.exports = isAdmin;