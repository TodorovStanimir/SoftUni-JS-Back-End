const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, Boolean, ObjectId } = Schema.Types;

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
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