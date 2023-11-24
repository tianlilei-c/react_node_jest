const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String
  }
});

const Articles = mongoose.model('articles', articlesSchema);

module.exports = Articles;
