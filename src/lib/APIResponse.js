import log4js from 'log4js';
const logger = log4js.getLogger();

export class APIResponse {

  constructor(instance) {
    if (instance instanceof Error) {
      logger.error(instance);
      this.responseError(instance);
    } else {
      this.responseSuccess(instance);
    }
  }

  responseError(instance) {
    if (instance.name === 'MongoServerError') {
      return Object.assign(this, {
        errors: [{
          name: 'DatabaseError',
          msg: 'Unable to proceed the request!'
        }]
      });
    }

    if (instance.name === 'MongooseError') {
      return Object.assign(this, {
        errors: [{
          name: 'DataValidationError',
          msg: 'Unable to validate the data you posted!'
        }]
      });
    }

    if (instance.name === 'APIError') {
      return Object.assign(this, {
        errors: [{
          name: instance.name,
          msg: instance.message,
          details: instance.details
        }]
      });
    }
  }

  responseSuccess(instance) {
    return Object.assign(this, {
      data: instance
    });
  }
}
