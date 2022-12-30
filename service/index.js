const cluster = require('cluster');
const { cpus } = require('os');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} running`);

  const systemCPUs = cpus().length;
  for (let i = 0; i < systemCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  /** Router needs to be moved into worker scope to prevent primary from accessing it */
  // eslint-disable-next-line global-require
  const router = require('./routes');

  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(router);

  const PORT = process.env.PORT ?? 1337;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening at http://localhost:${PORT}`);
  });
}
