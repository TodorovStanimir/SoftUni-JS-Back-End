const articleModel = require('./article')
const userModel = require('./user');
const tokenBlackListModel = require('./token-blacklist');
const categoryModel = require('./category')

module.exports = {
  userModel,
  tokenBlackListModel,
  articleModel,
  categoryModel
}