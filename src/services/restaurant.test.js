/**
 * Unit test for the API Services
 *
 * @group unit
 */
import { jest } from '@jest/globals';
import RestaurantService from './restaurant.js';
import Restaurant from '../models/restaurant.js';
import Reservation from '../models/reservation.js';

describe('Restaurant Service', () => {

  beforeEach(() => {
    expect.hasAssertions();

    Restaurant.findOneAndUpdate = jest.fn(function() {
      return {
        lean: function() {
          return arguments;
        }
      };
    });

    Reservation.deleteOne = jest.fn(function() {
      return Promise.resolve(1);
    });

  });


  it('Should update working hours', async () => {
    const service = new RestaurantService();
    const restaurantId = '61d4b04efafc4eb99190c7c4';
    const data = [{
      hour: 11,
      duration:
      600, day: 1,
      open: true
    }];
    const modelOptions = { upsert: false, returnDocument: 'after' };

    await service.updateWorkingHours(restaurantId, data);

    const params = Restaurant.findOneAndUpdate.mock.calls[0];

    expect(Restaurant.findOneAndUpdate).toHaveBeenCalled();
    expect(params[0]).toEqual({ _id: restaurantId });
    expect(params[1]).toEqual({ "workingHours": data });
    expect(params[2]).toEqual(modelOptions);
  });

  it('Should add a table', async () => {
    const service = new RestaurantService();
    const restaurantId = 1;
    const table = {
      name: "my-table",
      smooking: false,
      outdoor: false,
      floor: 1
    };

    const modelOptions = {
      upsert: false,
      returnDocument: 'after'
    };

    await service.addTable(restaurantId, table);
    const params = Restaurant.findOneAndUpdate.mock.calls[0];

    expect(Restaurant.findOneAndUpdate).toHaveBeenCalled();
    expect(params[0]).toEqual({
      _id: restaurantId,
      'tables.name': { $ne: table.name }
    });
    expect(params[1]).toEqual({
      $push: { tables: table}
    });
    expect(params[2]).toEqual(modelOptions);
  });

  it('Should delete a reservation', async () => {
    const service = new RestaurantService();
    const id = '1';
    await service.deleteReservation(id);

    expect(Reservation.deleteOne).toHaveBeenCalled();
  });

  it('Should PASS if reservation in workinghours', async () => {
    const service = new RestaurantService();
    service.restaurant = {
      workingHours: [
        { hour: 10, duration: 900, day: 1 , open: true },
      ]
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z'
    };

    const result = await service._isReservationInWorkingHours();
    expect(result).toBe(true);
  });

  it('Should FAIL if reservation is not in workinghours', async () => {
    const service = new RestaurantService();
    service.restaurant = {
      workingHours: [
        { hour: 10, duration: 90, day: 1 , open: true },
      ]
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z'
    };

    await expect(service._isReservationInWorkingHours())
      .rejects
      .toThrow(/is not within the working hours/);
  });


  it('Should FAIL if restaurant is closed on the day', async () => {
    const service = new RestaurantService();
    service.restaurant = {
      workingHours: [
        { hour: 10, duration: 900, day: 1 , open: false },
      ]
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z'
    };

    await expect(service._isReservationInWorkingHours())
      .rejects
      .toThrow(/restaurant is closed/);
  });


  it('Should FAIL if the reservation date is already past date', async () => {
    const service = new RestaurantService();
    service.restaurant = {
      workingHours: [
        { hour: 10, duration: 900, day: 6 , open: true },
      ]
    };
    service.reservation = {
      time: '2022-01-01T12:00:00.000Z'
    };

    await expect(service._isValidReservationDate())
      .rejects
      .toThrow(/You can make reservation only between/);
  });

  it('Should FAIL reservation date more than a year', async () => {
    const service = new RestaurantService();
    service.restaurant = {
      workingHours: [
        { hour: 10, duration: 900, day: 6 , open: true },
      ]
    };

    const time = new Date();
    time.setMonth(13);

    service.reservation = {
      time: time.toISOString()
    };

    await expect(service._isValidReservationDate())
      .rejects
      .toThrow(/You can make reservation only between/);
  });
});
