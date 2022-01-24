/**
 * Test reservation API
 *
 * @group integration
 */
import request from 'supertest';
import API from '../index.js';
import RestaurantService from '../../src/booking_manager/services/restaurant.js';

describe('Restaurant Settings', () => {
  // test working hours endpoints
  describe('Working Hours', () => {
    const data = [
      {'hour': 9, 'day': 1, 'duration': 720, 'open': true},
      {'hour': 9, 'day': 2, 'duration': 720, 'open': true},
      {'hour': 9, 'day': 3, 'duration': 720, 'open': true},
      {'hour': 9, 'day': 4, 'duration': 720, 'open': true},
      {'hour': 9, 'day': 5, 'duration': 720, 'open': true},
      {'hour': 11, 'day': 6, 'duration': 600, 'open': true},
      {'hour': 11, 'day': 0, 'duration': 600, 'open': false},
    ];

    const path = '/api/restaurant/61d4b04efafc4eb99190c7c4/settings';

    test('Should update working hours of a restaurant', (done) => {
      request(API).put(path + '/working-hours')
          .set('Accept', 'application/json')
          .send(data)
          .end((err, res) => {
            expect(res.status).toBe(201);
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data).toStrictEqual(data);
            done();
          });
    });

    test('Should return error 400 when invalid data posted', (done) => {
      const invalidData = data.slice(0, 6);

      request(API).put(path + '/working-hours')
          .set('Accept', 'application/json')
          .send(invalidData)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBeUndefined();
            done();
          });
    });

    test('Should return error 400 when string posted', (done) => {
      const invalidData = Object.assign({}, data);
      invalidData[0].hour = 'notAnIntger';

      request(API).put(path + '/working-hours')
          .set('Accept', 'application/json')
          .send(invalidData)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBeUndefined();
            done();
          });
    });
  });

  describe('Tables', () => {
    /**
     * @return {string}
     */
    function randomStr() {
      return Math.random().toString(36).substr(2, 10);
    }

    const data = {
      name: 'dummy-table-name-' + randomStr(),
      smoking: false,
      outdoor: true,
      seat: 12,
      floor: 1,
    };

    const path = '/api/restaurant/61d4b04efafc4eb99190c7c4/settings';

    test('Should add a table', (done) => {
      request(API).post(path + '/tables')
          .set('Accept', 'application/json')
          .send(data)
          .end((err, res) => {
            expect(res.status).toBe(201);
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data._id).toBeDefined();
            expect(res.body.data.name).toStrictEqual(data.name);

            // delete the created table
            try {
              const service = new RestaurantService();
              service.deleteTable(res.body.data);
            } catch (e) {
              throw new Error('Unable to delete the table');
            }
            done();
          });
    });

    test('400 Error when invalid data posted', (done) => {
      const invalidData = Object.assign({}, data);
      invalidData.name = 1;
      invalidData.floor = 'invalid-floor';

      request(API).post(path + '/tables')
          .set('Accept', 'application/json')
          .send(invalidData)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBeUndefined();
            done();
          });
    });

    test('Should update a table', (done) => {
      const validData = Object.assign({}, data);
      validData._id = '61dfb791e0205efb80f083ee';
      validData.name = 'updated-name' + randomStr();
      validData.floor = 9;
      request(API).put(path + '/tables')
          .set('Accept', 'application/json')
          .send(validData)
          .end((err, res) => {
            expect(res.status).toBe(201);
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data.name).toStrictEqual(validData.name);
            expect(res.body.data.floor).toStrictEqual(validData.floor);
            done();
          });
    });

    test('Should be 400 response when invalid data putted', (done) => {
      const invalidData = Object.assign({}, data);
      invalidData._id = '61dfb791e0205efb80f083ee';
      invalidData.floor = randomStr();
      request(API).put(path + '/tables')
          .set('Accept', 'application/json')
          .send(invalidData)
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBeUndefined();
            done();
          });
    });
  });
});
