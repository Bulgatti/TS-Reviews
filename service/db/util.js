const crypto = require('crypto');

module.exports = {
  generateID: () => {
    const id = crypto.randomUUID().match(/\d/g).join('');
    return id.slice(0, Math.floor(id.length / 2));
  },
};
