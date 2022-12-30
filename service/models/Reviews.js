const { Reviews } = require('../db');

module.exports = {
  getReviews: (product, options) => {
    try {
      if (!options) return Promise.resolve(Reviews.find({ product_id: product }).lean());
      return Promise.resolve(Reviews.find({ product_id: product, reported: false })
        .skip((options.page - 1) * 5)
        .limit(options.count)
        .sort(options.sort)
        .lean());
    } catch (error) {
      return Promise.reject(error);
    }
  },
  addReview: review => {
    try {
      return Promise.resolve(Reviews.create(review));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateReview: (review, update) => {
    try {
      return Promise.resolve(Reviews.updateOne(review, update));
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
