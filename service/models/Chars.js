const { Chars } = require('../db');

module.exports = {
  getChars: async char => {
    try {
      return Promise.resolve(Chars.find({ characteristic_id: char }).lean());
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
