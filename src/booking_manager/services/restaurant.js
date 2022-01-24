import Restaurant from '../../commonlib/models/restaurant.js';
import Reservation from '../../commonlib/models/reservation.js';
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
   * @param {String|ObjctId} _id
   * @return {Promise}
   */
  deleteReservation(_id) {
    return Reservation.deleteOne({_id}).then((response) => {
      return response;
    });
  }

  /**
   * @param {Reservation} reservation
   * @return {Promise}
   */
  createReservation(reservation) {
    this.reservation = reservation;
    return this.checkReservationValidity().then((response) => {
      return reservation.save();
    });
  }

  /**
   * @param {Reservation} reservation
   * @return {Promise}
   */
  updateReservation(reservation) {
    this.reservation = reservation;
    return this.checkReservationValidity().then((response) => {
      const query = {_id: this.reservation._id};
      return Reservation.findOneAndUpdate(query, reservation, {
        returnDocument: 'after',
        upsert: false,
      });
    });
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

  /**
   * @return {Promise}
   */
  async checkReservationValidity() {
    const checkIsTableFree = this._isTableFreeForReservation();
    const checkWorkingHours = this._isReservationInWorkingHours();
    const checkIsValidDate = this._isValidReservationDate();
    const checkTableEnable = this._isTableEnableForReservation();
    const checkCapacity = this._checkCapacity();

    return Promise.all([
      checkWorkingHours,
      checkIsValidDate,
      checkIsTableFree,
      checkTableEnable,
      checkCapacity,
    ]);
  }

  /**
   * @return {Promise}
   * @throw {APIError}
   */
  async _checkCapacity() {
    const table = this.restaurant.tables.find(
        (table) => table.id.valueOf() === this.reservation.tableId.valueOf());
    if (this.reservation.people <= table.seat) {
      return true;
    }

    throw new APIError('The seat capacity of this table is not enough!', {
      table: table._id,
      capacity: table.seat,
      requiredCapacity: this.reservation.people,
    });
  }

  /**
   * @return {Boolean}
   */
  async _isTableEnableForReservation() {
    const table = this.restaurant.tables.find(
        (table) => table.id.valueOf() === this.reservation.tableId.valueOf());
    if (!table) {
      throw new APIError('This table is not reservable!', {
        tableId: this.reservation.tableId,
      });
    }
    return true;
  }

  /**
   * @return {Boolean}
   * @throw {APIError}
   */
  async _isTableFreeForReservation() {
    const query = {
      tableId: this.reservation.tableId,
      restaurantId: this.reservation.restaurantId,
      time: this.reservation.time,
    };
    const result = await Reservation.findOne(query).exec();

    if (!result) {
      return true;
    }

    if (this.reservation._id.valueOf() === result._id.valueOf()) {
      return true;
    }

    throw new APIError(
        'The table you selected is already reserved',
        {...result._doc},
    );
  }

  /**
   * @return {Boolean}
   * @throw {APIError}
   */
  async _isValidReservationDate() {
    const min = new Date();
    const max = new Date(new Date().setFullYear(min.getFullYear() + 1));
    const time = new Date(this.reservation.time);

    if (time < min || time > max) {
      throw new APIError(
          `You can make reservation only between
          ${min.toISOString()} and ${max.toISOString()}`,
          {min, max},
      );
    }
    return true;
  }

  /**
   * @return {Boolean}
   * @throw {APIError}
   */
  async _isReservationInWorkingHours() {
    const time = new Date(this.reservation.time);

    const weekDay = this.restaurant.workingHours.find(
        (item) => item.day === time.getDay(),
    );
    if (!weekDay.open) {
      throw new APIError(
          'The restaurant is closed on the day you choose!',
          {isOpen: weekDay.open},
      );
    }

    const opening = new Date(time);
    opening.setHours(weekDay.hour);
    const closing = new Date(opening);
    closing.setMinutes(weekDay.duration);

    if (time < opening || time >= closing) {
      throw new APIError(
          'Selected time is not within the working hours of our restaurant!',
          {opening, closing, time},
      );
    }
    return true;
  }
}

export default RestaurantService;
