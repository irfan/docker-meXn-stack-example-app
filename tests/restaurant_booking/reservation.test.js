/**
 * Test restaurant API service
 *
 * @group integration/restaurant_booking
 */

import request from 'supertest';
import API from './index.js';
import {nextSunday, nextWednesday, format} from 'date-fns';

describe('Reservation Endpoint', () => {
  beforeEach(() => {
    expect.hasAssertions();
  });

  // test creating reservation
  describe('List Available Tables/Hours', () => {
    const endpoint = '/api/restaurant/61d4b04efafc4eb99190c7c4/';

    test('Should list tables with availability', (done) => {
      const dayToTest = format(nextWednesday(new Date()), 'yyyy-MM-dd');
      const fullPath = endpoint + dayToTest;
      request(API).get(fullPath)
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data).toBeDefined();
            done();
          });
    });

    test('Should list only tables if restaurant closed', (done) => {
      const dayToTest = format(nextSunday(new Date()), 'yyyy-MM-dd');
      const fullPath = endpoint + dayToTest;
      request(API).get(fullPath)
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(res.status).toBe(200);
            expect(res.body.errors).toBeUndefined();
            expect(res.body.data).toBeDefined();
            expect(res.body.data.isOpen).toBe(false);
            expect(res.body.data.tables[0].availability.length).toBe(0);
            done();
          });
    });

    test('Should return 400 Error if invalid date passed', (done) => {
      const dayToTest = '2025-14-05';
      const fullPath = endpoint + dayToTest;
      request(API).get(fullPath)
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
            expect(res.body.data).toBeUndefined();
            done();
          });
    });
  });
});
