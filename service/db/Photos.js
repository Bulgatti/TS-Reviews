const mongoose = require('mongoose');
const { generateID } = require('./util');

const photoSchema = mongoose.Schema({
  id: { type: Number, default: generateID },
  review_id: { type: Number, required: true, index: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model('photo', photoSchema, 'photos');
