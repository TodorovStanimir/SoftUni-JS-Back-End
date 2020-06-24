const jwt = require('./jwt');
const appConfig = require('../app-config');
const { userModel, tokenBlackListModel } = require('../models');

function guard() {
  return function (req, res, next) {
    const token = req.cookies[appConfig.authCookieName] || '';
    if (!token) { next(); return}
    Promise.resolve(jwt.verifyToken(token))
      .then(data => {
        if (data) {
          res.redirect('/');
          return;
        }
        next();
      }).catch(error => {
        next(error);
      });
  }
}

module.exports = guard;