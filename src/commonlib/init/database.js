import mongoose from 'mongoose';
import config from '../config/index.js';
import log4js from 'log4js';

const logger = log4js.getLogger();

export default async () => {
  try {
    return (await mongoose.connect(
        config.connectionString, config.connectionOptions)
    ).connection.db;
  } catch (e) {
    logger.error(e);
    throw (e);
  }
};
