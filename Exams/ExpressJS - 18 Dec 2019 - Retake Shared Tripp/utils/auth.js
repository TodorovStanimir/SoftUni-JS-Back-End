const jwt = require('./jwt');
const config = require('../config/config');
const models = require('../models');

function auth(redirectUnauthenticated = true) {

    return async function (req, res, next) {
        try {
            const token = req.cookies[config.cookieSecret] || '';
            const decodetToken = jwt.verifyToken(token);
            const blacklistedToken = await models.TokenBlackList.findOne({ token });

            if (blacklistedToken) {
                throw new Error('blacklisted token');
            }

            const user = await models.User.findById(decodetToken.id);
            req.user = user;

            if (req.url.includes('login') || req.url.includes('register')) {
                res.redirect('/');
                return;
            }

            next();
        } catch (error) {
            if (!redirectUnauthenticated) { next(); return; }

            if (['token expired', 'blacklisted token', 'jwt must be provided', 'jwt expired'].includes(error.message)) {
                res.redirect('/user/login');
                return;
            }
            next(error);
        }
    }
}

module.exports = auth;