/**
 * @class APIError
 */
export class APIError extends Error {
/**
 * @constructor
 * @param {string} message
 * @param {object} details
 */
  constructor(message = null, details = {}) {
    super(message);
    this.message = message;
    this.details = details;
    this.name = 'APIError';
    this.date = new Date();
  }
}
