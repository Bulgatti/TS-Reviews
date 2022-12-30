const { Photos } = require('../db');

module.exports = {
  getPhotos: review => {
    try {
      return Promise.resolve(Photos.find(review).lean());
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
