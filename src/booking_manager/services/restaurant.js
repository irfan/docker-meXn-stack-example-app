import Restaurant from '../../commonlib/models/restaurant.js';
import {APIError} from '../../commonlib/lib/APIError.js';

/**
 * Restaurat service
 */
class RestaurantService {
  /**
   * @param {Restaurant|null} restaurant
   */
  constructor(restaurant = null) {
    this.reservation = null;
    this.restaurant = restaurant;
  }

  /**
   * @param {String|ObjctId} restaurantId
   * @param {Array} data weekly working hours data
   * @return {Promise}
   */
  async updateWorkingHours(restaurantId, data) {
    return Restaurant.findOneAndUpdate({_id: restaurantId}, {
      workingHours: data,
    },
    {
      returnDocument: 'after',
      upsert: false,
    });
  }

  /**
   * @param {String|ObjctId} restaurantId
   * @param {Object} table a restaurant table data
   * @return {Promise}
   */
  async addTable(restaurantId, table) {
    return Restaurant.findOneAndUpdate({
      '_id': restaurantId,
      'tables.name': {$ne: table.name},
    },
    {
      $push: {tables: table},
    },
    {
      upsert: false,
      returnDocument: 'after',
    }).lean();
  }

  /**
   * @param {Object} table
   * @return {Promise}
   */
  async deleteTable(table) {
    return Restaurant.updateOne({_id: table.restaurantId}, {
      $pull: {
        tables: {
          _id: table._id,
        },
      },
    });
  }

  /**
   * @param {String|ObjctId} restaurantId
   * @param {Object} table a restaurant table data
   * @return {Promise}
   */
  async updateTable(restaurantId, table) {
    return Restaurant.findOneAndUpdate({
      '_id': restaurantId,
      'tables._id': table._id,
    },
    {
      'tables.$.name': table.name,
      'tables.$.smoking': table.smoking,
      'tables.$.outdoor': table.outdoor,
      'tables.$.floor': table.floor,
    },
    {
      upsert: false,
      returnDocument: 'after',
    });
  }
}

export default RestaurantService;
