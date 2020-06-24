const config = require('../config/config');
const jwt = require('./jwt');

module.exports = getUserStatus = (req, res, next) => {

    try {
        const token = req.cookies[config.cookieSecret] || '';
        const decodetToken = jwt.verifyToken(token);

        res.locals = {
            isLoggedIn: decodetToken !== null,
            username: decodetToken.username
        }

        next();
    } catch (error) {

        res.locals = {
            isLoggedIn: false,
            username: null
        }

        next();
    }
} 