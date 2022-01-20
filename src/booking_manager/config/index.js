import dotenv from 'dotenv';

if (dotenv.config().error) {
  throw new Error('dotenv not found!');
}

export default {
  // application
  servePath: process.env.API_SERVE_PATH,

  // log
  logPath: process.env.APPLICATION_LOG_PATH,
  debugLogFile: process.env.APPLICATION_LOG_PATH + '/debug.log',
  errorLogFile: process.env.APPLICATION_LOG_PATH + '/error.log',

  // database
  port: parseInt(process.env.PORT, 10),
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  dbAuthSource: process.env.DB_AUTH_SOURCE,
  connectionString: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}?retryWrites=true&w=majority`,
  connectionOptions: {
    dbName: process.env.DB_NAME,
    authSource: process.env.DB_AUTH_SOURCE,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
};
