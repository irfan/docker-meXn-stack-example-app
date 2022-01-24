/**
 * Test reservation API
 *
 * @group integration
 */

import request from 'supertest';
import API from '../index.js';

describe('Restaurant', () => {
  test('GET main page', (done) => {
    request(API).get('/')
        .set('Accept', 'text/html')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.text).toEqual(expect.stringContaining('github.com'));
          done();
        });
  });

  test('GET restaurant details', (done) => {
    request(API).get('/api/restaurant/61d4b04efafc4eb99190c7c4')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toBe(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.errors).toBeUndefined();
          done();
        });
  });

  test('500 Error on wrong restaurant ID', (done) => {
    // the restaurant ID does not exists!
    request(API).get('/api/restaurant/61d4b04efafc4eb99190c7c5')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toBe(500);
          expect(res.body.data).toBeUndefined();
          expect(res.body.errors.length).toBe(1);
          done();
        });
  });

  test('500 Error on invalid string', (done) => {
    // the restaurant ID is an invalid string
    request(API).get('/api/restaurant/invalid-restaurant-id')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).toBe(500);
          expect(res.body.data).toBeUndefined();
          expect(res.body.errors.length).toBe(1);
          done();
        });
  });
});
