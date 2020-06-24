const mongoose = require('mongoose');
const config = require('./config');
const dbName = 'exam19042019';

module.exports = () => {
  return mongoose.connect(config.dbUrl + dbName, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    console.log('Database is Ready!'));
};