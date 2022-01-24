'use strict';
import express from 'express';
import log4js from 'log4js';

import config from '../commonlib/config/index.js';

const logger = log4js.getLogger();
const app = express();

const initialize = (await import('./init/index.js')).init(app);

initialize.then((promises) => {
  Promise.all(promises).then((results) => {
    logger.info('Restaurant Booking Services up & ready!');

    app.listen(config.port, () => {
      logger.info(`
      === Restaurant Booking server is ready on port ${config.port} ===
      `);
    }).on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
  });
});
