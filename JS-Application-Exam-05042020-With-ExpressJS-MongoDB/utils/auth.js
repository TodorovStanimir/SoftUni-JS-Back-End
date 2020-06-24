const jwt = require('./jwt');
const appConfig = require('../app-config');
const { userModel, tokenBlackListModel } = require('../models');

function auth(redirectUnauthenticated = true) {
  return function (req, res, next) {
    const token = req.cookies[appConfig.authCookieName] || '';
    Promise.all([
      jwt.verifyToken(token),
      tokenBlackListModel.findOne({ token })
    ]).then(([data, blacklistedToken]) => {
      if (blacklistedToken) {
        return Promise.reject(new Error('blacklisted token'))
      }
      userModel.findById(data.id).then(user => {
        req.user = user;
        next();
      });
    }).catch(error => {
      if (!redirectUnauthenticated) { next(); return; }
      if (['token expired', 'blacklisted token', 'jwt must be provided', 'jwt expired'].includes(error.message)) {
        res.redirect('/login');
        return;
      }
      next(error);
    });
  }
}

module.exports = auth;
