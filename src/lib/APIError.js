export class APIError extends Error {

  constructor(message = null, details = {}) {
    super(message);
    this.message = message;
    this.details = details;
    this.name = 'APIError';
    this.date = new Date();
  }
}
