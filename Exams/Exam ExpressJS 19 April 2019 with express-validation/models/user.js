const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, Boolean, ObjectId } = Schema.Types;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  enrolledCourses: [
    {
      type: ObjectId,
      ref: 'Course'
    }
  ]
})

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(config.saltRounds, (err, salt) => {
      if (err) { next(err); return }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) { next(err); return }
        this.password = hash;
        next();
      })
    });
    return;
  }
  next();
})

userSchema.methods = {
  matchPassword: function (password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = new Model('User', userSchema);