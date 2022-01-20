import {body, param, check} from 'express-validator';
import {ObjectId} from 'mongodb';

/**
 * @param {string} str the object id location
 * @return {ObjectId} restaurantId
 */
export function paramMongoId(str) {
  return param(str).customSanitizer((restaurantId) => {
    return new ObjectId(restaurantId);
  });
}

/**
 * @param {string} str the object id location
 * @return {ObjectId} restaurantId
 */
export function bodyMongoId(str) {
  return check(str).customSanitizer((restaurantId) => {
    return new ObjectId(restaurantId);
  });
}

/**
 * @param {string} str the isodate location
 * @return {string} reservation time as iso date format
 */
export function reservationTime(str) {
  return check(str).customSanitizer((isoDate) => {
    const date = new Date(isoDate);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  });
}

/**
 * @param {array} allowList
 * @return {Bool}
 * @throw {Error}
 */
export function allowOnly(allowList) {
  return body().custom((body) => {
    Object.keys(body).forEach((item) => {
      if (!allowList.includes(item)) {
        throw new Error(`Malicious property ${item}`);
      }
    });
    return true;
  });
}

/**
 * @param {array} propList allowed list of props
 * @param {object} options
 * @throw {Error}
 * @return {Bool}
 */
export function allowArrayOnly(propList, options) {
  return body().custom((body) => {
    if (!Array.isArray(body)) {
      throw new Error('The request body is not an array!');
    }

    const length = body.length;
    const min = parseInt(options.min, 10);
    const max = parseInt(options.max, 10);

    if (length < min || length > max) {
      throw new Error(`body array size should be between ${min} and ${max}`);
    }

    body.forEach((arrItem) => {
      Object.keys(arrItem).forEach((item, i) => {
        if (!propList.includes(item)) {
          throw new Error(`Malicious property ${item} on index ${i}`);
        }
      });
    });
    return true;
  });
}
