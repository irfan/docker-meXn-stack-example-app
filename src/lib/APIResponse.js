import log4js from 'log4js';
const logger = log4js.getLogger();

/**
 * @class APIError
 */
export class APIResponse {
/**
 * @constructor
 * @param { Error | Object} instance
 */
  constructor(instance) {
    if (instance instanceof Error) {
      logger.error(instance);
      this.responseError(instance);
    } else {
      this.responseSuccess(instance);
    }
  }

  /**
   * @param { Error } instance
   * @return { APIError } error response
   */
  responseError(instance) {
    if (instance.name === 'MongoServerError') {
      return Object.assign(this, {
        errors: [{
          name: 'DatabaseError',
          msg: 'Unable to proceed the request!',
        }],
      });
    }

    if (instance.name === 'MongooseError') {
      return Object.assign(this, {
        errors: [{
          name: 'DataValidationError',
          msg: 'Unable to validate the data you posted!',
        }],
      });
    }

    if (instance.name === 'APIError') {
      return Object.assign(this, {
        errors: [{
          name: instance.name,
          msg: instance.message,
          details: instance.details,
        }],
      });
    }
  }

  /**
   * @param { Object } instance
   * @return { APIResponse } success response
   */
  responseSuccess(instance) {
    return Object.assign(this, {
      data: instance,
    });
  }
}
