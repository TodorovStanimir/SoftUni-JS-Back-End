const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
  return mongoose.connect(config.dbUrl + config.database, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    console.log('Database is Ready!'));
};