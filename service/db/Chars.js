const mongoose = require('mongoose');
const { generateID } = require('./util');

const charSchema = mongoose.Schema({
  id: { type: Number, default: generateID },
  characteristic_id: { type: Number, required: true },
  review_id: { type: Number, required: true, index: true },
  value: { type: Number, required: true },
});

module.exports = mongoose.model('char', charSchema, 'chars');
