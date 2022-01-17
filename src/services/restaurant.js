import Restaurant from '../models/restaurant.js';
import Reservation from '../models/reservation.js';
import { APIError } from '../lib/APIError.js';
import log4js from 'log4js';

const logger = log4js.getLogger();

class RestaurantService {

  constructor(restaurant = null) {
    this.reservation = null;
    this.restaurant = restaurant;
  }

  deleteReservation(_id) {
    return Reservation.deleteOne({ _id }).then(response => {
      return response;
    });
  }

  createReservation(reservation) {
    this.reservation = reservation;
    return this.checkReservationValidity().then(response => {
      return reservation.save();
    });
  }

  updateReservation(reservation) {
    this.reservation = reservation;
    return this.checkReservationValidity().then(response => {
      const query = { _id: this.reservation._id };
      return Reservation.findOneAndUpdate(query, reservation, {
        returnDocument: 'after',
        upsert: false
      });
    });
  }

  async updateWorkingHours(restaurantId, data) {
    return Restaurant.findOneAndUpdate({ _id: restaurantId }, {
      workingHours: data
    },
    {
      returnDocument: 'after',
      upsert: false
    });
  }

  async addTable(restaurantId, table) {
    return Restaurant.findOneAndUpdate({
      _id: restaurantId,
      'tables.name': { $ne: table.name }
    },
    {
      $push: { tables: table }
    },
    {
      upsert: false,
      returnDocument: 'after'
    }).lean();
  }

  async deleteTable(table) {
    return Restaurant.updateOne({ _id: table.restaurantId }, {
      $pull: {
        tables: {
          _id : table._id
        }
      }
    });
  }

  async updateTable(restaurantId, table) {
    return Restaurant.findOneAndUpdate({
      _id: restaurantId,
      'tables._id': table._id
    },
    {
      'tables.$.name': table.name,
      'tables.$.smoking': table.smoking,
      'tables.$.outdoor': table.outdoor,
      'tables.$.floor': table.floor
    },
    {
      upsert: false,
      returnDocument: 'after'
    });
  }

  async checkReservationValidity() {
    const checkIsTableFree = this._isTableFreeForReservation();
    const checkWorkingHours = this._isReservationInWorkingHours();
    const checkIsValidDate = this._isValidReservationDate();
    const checkTableEnable = this._isTableEnableForReservation();

    return Promise.all([
      checkWorkingHours,
      checkIsValidDate,
      checkIsTableFree,
      checkTableEnable
    ]);
  }

  async _isTableEnableForReservation() {
    const table = this.restaurant.tables.find(table => table.id.valueOf() === this.reservation.tableId.valueOf());
    if (!table) {
      throw new APIError('This table is not reservable!', {
        tableId: this.reservation.tableId
      });
    }
    return true;
  }

  async _isTableFreeForReservation() {
    const query = {
      tableId: this.reservation.tableId,
      restaurantId: this.reservation.restaurantId,
      time: this.reservation.time
    };
    const result = await Reservation.findOne(query).exec();

    if (!result) {
      return true;
    }

    if (this.reservation._id.valueOf() === result._id.valueOf()) {
      return true;
    }

    throw new APIError('The table you selected is already reserved for this time!', {...result._doc});
  }

  async _isValidReservationDate() {
    const min = new Date();
    const max = new Date(new Date().setFullYear(min.getFullYear() + 1));
    const time = new Date(this.reservation.time);

    if (time < min || time > max) {
      throw new APIError(
        `You can make reservation only between ${min.toISOString()} and ${max.toISOString()}`, { min, max }
      );
    }
  }

  async _isReservationInWorkingHours() {
    const time = new Date(this.reservation.time);

    const weekDay = this.restaurant.workingHours.find(
      item => item.day === time.getDay()
    );
    if (!weekDay.open) {
      throw new APIError('The restaurant is closed on the day you choose!', { isOpen: weekDay.open });
    }

    const opening = new Date(time);
    opening.setHours(weekDay.hour);
    const closing = new Date(opening);
    closing.setMinutes(weekDay.duration);

    if (time < opening || time >= closing) {
      throw new APIError(
        'The time you have chosen is not within the working hours of our restaurant!',
        { opening, closing, time }
      );
    }
    return true;
  }

}

export default RestaurantService;
