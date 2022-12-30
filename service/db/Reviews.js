const mongoose = require('mongoose');
const { generateID } = require('./util');

const reviewSchema = mongoose.Schema({
  id: { type: Number, default: generateID },
  product_id: { type: Number, required: true, index: true },
  rating: { type: Number, required: true },
  summary: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Number, default: () => (new Date()).getTime() },
  recommend: { type: Boolean, required: true },
  helpfulness: { type: Number, default: 0 },
  reported: { type: Boolean, default: false, enum: [true, false] },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('review', reviewSchema, 'reviews');
