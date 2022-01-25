import Reservation from '../../commonlib/models/reservation.js';

/**
 * Reservation service for restaurant_booking api
 */
class ReservationService {
  /**
   * @param {null|restaurant} restaurant
   */
  constructor(restaurant = null) {
    this.restaurant = restaurant;
    this.timeSlots = [];
  }

  /**
   * @param {Date} date
   * @return {object}
   */
  getWorkingHours(date) {
    return this.restaurant.workingHours.find((i) => i.day === date.getDay());
  }

  /**
   * @param {Date} date
   * @return {object}
   */
  isRestaurantOpen(date) {
    const workingHours = this.getWorkingHours(date);
    return workingHours.open;
  }

  /**
   * @param {null|Array} tableAvailability
   */
  setAvailability(tableAvailability = null) {
    this.restaurant.tables.forEach((table) => {
      table.availability = tableAvailability || [];
    });
  }

  /**
   * @param {Date} date
   * @return {object}
   */
  availableTables(date) {
    return {
      isOpen: this.isRestaurantOpen(date),
      tables: this.restaurant.tables || [],
    };
  }

  /**
   * @param {Date} date
   * @return {object}
   */
  async getAvailabilityByDate(date) {
    if (!this.isRestaurantOpen(date)) {
      this.setAvailability();
      return this.availableTables(date);
    }

    return this.getReservations(date).then((reservations) => {
      this.restaurant.tables.forEach((table) => {
        table.availability = [...this.timeSlots];
      });

      reservations.forEach((reservation) => {
        const table = this.restaurant.tables.find((item) =>
          item._id = reservation.tableId);
        table.availability = table.availability.filter((time) => {
          return reservation.time != time;
        });
      });

      return this.availableTables(date);
    });
  }

  /**
   * @param {Date} date
   * @return {Reservation}
   */
  async getReservations(date) {
    this.generateSlots(date);
    const query = {
      restaurantId: this.restaurant._id,
      time: {$gte: this.timeSlots.at(0), $lte: this.timeSlots.at(-1)},
    };
    const fields = {tableId: 1, time: 1};
    return Reservation.find(query, fields).lean().exec();
  }

  /**
   * @param {Date} dayStart
   */
  generateSlots(dayStart) {
    const wHours = this.getWorkingHours(dayStart);
    dayStart.setHours(wHours.hour);
    const dayEnd = new Date(dayStart);
    dayEnd.setMinutes(wHours.duration);

    const slots = [];
    slots.push(dayStart.toISOString());
    let notLastHour = true;

    while (notLastHour) {
      const nextSlot = new Date(slots.at(-1));
      nextSlot.setMinutes(60);
      if (nextSlot >= dayEnd) {
        notLastHour = false;
        break;
      }
      slots.push(nextSlot.toISOString());
    }

    this.timeSlots = slots;
  }
}

export default ReservationService;
