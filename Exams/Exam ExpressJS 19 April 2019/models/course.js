const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, Boolean, ObjectId } = Schema.Types;

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: [4, 'Title course length should be at least 4 characters long!'],
  },
  description: {
    type: String,
    required: true,
    minlength: [20, 'Description length should be at least 20 characters long!'],
    maxlength: [50, 'Description length should be not more then 50 characters long!'],
  },
  imageUrl: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.+/, `imageUrl should starts with http:// or https://!`],
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  usersEnrolled: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  creatorId: {
    type: ObjectId,
    required: true
  }
})


module.exports = new Model('Course', courseSchema);