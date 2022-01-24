import mongoose from '../../commonlib/init/database.js';
import server from './express.js';
import logger from '../../commonlib/config/logger.js';

/**
 * @param {Express} app
 */
export async function init(app) {
  logger.info('Initializing services...');

  // logger configured auto by calling here
  const Log4JS = Promise.resolve(logger);
  Log4JS.then(() => logger.info(`√ Log4JS configured`)).catch((e) => {
    logger.error(e);
    process.exit(1);
  });

  // init database (mongodb)
  const MongoDB = mongoose();
  MongoDB.then(() => logger.info(`√ MongoDB ready`)).catch((e) => {
    logger.error(e);
    process.exit(1);
  });

  // init api server (nodejs, express server)
  const API = server(app);
  API.then(() => logger.info(`√ API ready`)).catch((e) => {
    logger.error(e);
    process.exit(1);
  });

  return [Log4JS, MongoDB, API];
}
