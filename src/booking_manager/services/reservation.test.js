/**
 * Reservation Service
 *
 * @group unit
 */
import {jest} from '@jest/globals';
import ReservationService from './reservation.js';
import Reservation from '../../commonlib/models/reservation.js';

describe('Reservation Service', () => {
  beforeEach(() => {
    expect.hasAssertions();

    Reservation.deleteOne = jest.fn(function() {
      return Promise.resolve(1);
    });
  });


  it('Should delete a reservation', async () => {
    const service = new ReservationService();
    const id = '1';
    await service.deleteReservation(id);

    expect(Reservation.deleteOne).toHaveBeenCalled();
  });

  it('Should PASS if reservation in workinghours', async () => {
    const service = new ReservationService();
    service.restaurant = {
      workingHours: [
        {hour: 10, duration: 900, day: 1, open: true},
      ],
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z',
    };

    const result = await service._isReservationInWorkingHours();
    expect(result).toBe(true);
  });

  it('Should FAIL if reservation is not in workinghours', async () => {
    const service = new ReservationService();
    service.restaurant = {
      workingHours: [
        {hour: 10, duration: 90, day: 1, open: true},
      ],
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z',
    };

    await expect(service._isReservationInWorkingHours())
        .rejects
        .toThrow(/is not within the working hours/);
  });


  it('Should FAIL if restaurant is closed on the day', async () => {
    const service = new ReservationService();
    service.restaurant = {
      workingHours: [
        {hour: 10, duration: 900, day: 1, open: false},
      ],
    };
    service.reservation = {
      time: '2022-02-14T12:00:00.000Z',
    };

    await expect(service._isReservationInWorkingHours())
        .rejects
        .toThrow(/restaurant is closed/);
  });


  it('Should FAIL if the reservation date is already past date', async () => {
    const service = new ReservationService();
    service.restaurant = {
      workingHours: [
        {hour: 10, duration: 900, day: 6, open: true},
      ],
    };
    service.reservation = {
      time: '2022-01-01T12:00:00.000Z',
    };

    await expect(service._isValidReservationDate())
        .rejects
        .toThrow(/You can make reservation only between/);
  });

  it('Should FAIL reservation date more than a year', async () => {
    const service = new ReservationService();
    service.restaurant = {
      workingHours: [
        {hour: 10, duration: 900, day: 6, open: true},
      ],
    };

    const time = new Date();
    time.setMonth(13);

    service.reservation = {
      time: time.toISOString(),
    };

    await expect(service._isValidReservationDate())
        .rejects
        .toThrow(/You can make reservation only between/);
  });
});
