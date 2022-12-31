const { ProductChars } = require('../db');

module.exports = {
  getProductChars: product => {
    try {
      return Promise.resolve(ProductChars.find({ product_id: product }).lean());
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
