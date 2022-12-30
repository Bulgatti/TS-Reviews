const cluster = require('cluster');

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const DB_NAME = process.env.DB_NAME ?? 'reviewsdb';
const DB_URL = `mongodb://localhost/${DB_NAME}`;
mongoose.connect(DB_URL)
  .catch(() => {
    console.error(`Worker ${cluster.worker.process.pid} failed to connect to MongoDB. Killing.`);
    cluster.worker.kill();
  });

module.exports.Reviews = require('./Reviews');
module.exports.Photos = require('./Photos');
module.exports.ProductCharacteristics = require('./ProductCharacteristics');
module.exports.Characteristics = require('./Characteristics');
