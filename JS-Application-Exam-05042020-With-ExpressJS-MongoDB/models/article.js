const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Article title required!"]
  },
  category: {
    type: mongoose.Types.ObjectId, ref: 'Category'
  },
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  creatorId: {
    type: mongoose.Types.ObjectId, ref: 'User'
  }
})

module.exports = mongoose.model('Article', articleSchema);