'use strict';
import express from 'express';

import config from './config/index.js';
import log4js from 'log4js';

const logger = log4js.getLogger();
const app = express();

const initialize = (await import('./init/index.js')).init(app);

initialize.then((promises) => {
  Promise.all(promises).then((results) => {
    logger.info('Services up & ready!');

    app.listen(config.port, () => {
      logger.info(`
      === Booking manager server is ready on port ${config.port} ===
      `);
    }).on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
  });
});
