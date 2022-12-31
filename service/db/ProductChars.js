const mongoose = require('mongoose');
const { generateID } = require('./util');

const productCharSchema = mongoose.Schema({
  id: { type: Number, default: generateID },
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('productchar', productCharSchema, 'productchars');
