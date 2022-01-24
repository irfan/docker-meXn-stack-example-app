import log4js from 'log4js';
import config from './index.js';

log4js.configure({
  appenders: {
    allLogs: {
      type: 'file',
      filename: config.debugLogFile,
    },
    errors: {
      type: 'file',
      filename: config.errorLogFile,
    },
    errorsOnly: {
      type: 'logLevelFilter',
      appender: 'errors',
      level: 'error',
    },
  },
  categories: {
    default: {
      appenders: ['errorsOnly', 'allLogs'],
      level: 'trace',
    },
  },
});

export default log4js.getLogger();
