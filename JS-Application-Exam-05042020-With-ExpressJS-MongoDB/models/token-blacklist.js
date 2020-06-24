const mongoose = require('mongoose');

const tokenBlackList = new mongoose.Schema({
    token: String
})


module.exports = mongoose.model('TokenBlackList', tokenBlackList);