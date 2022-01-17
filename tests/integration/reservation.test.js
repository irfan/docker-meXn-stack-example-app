/**
 * Test reservation API
 *
 * @group integration
 */

import request from 'supertest';
import express from 'express';
import API from '../index.js';
import RestaurantService from '../../src/services/restaurant.js';

import { nextSunday, nextWednesday, nextTuesday, nextFriday } from 'date-fns'; 

describe('Reservation Endpoint', () => {

  // test creating reservation
  describe('Create Reservation', () => {
    const data = {
      tableId: "61dfb791e0205efb80f083ee",
      name: "Irfan Durmus",
      phone: "5327646161",
      time: nextWednesday(new Date().setUTCHours(13)).toISOString()
    }

    test('Should create a new reservation', done => {
      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(data)
        .end((err, res) => {
          expect(res.status).toBe(201);
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data._id).toBeDefined();
          // delete the created reservation
          try {
            const service = new RestaurantService();
            service.deleteReservation(res.body.data._id);
          } catch (e) {
            throw new Error('Unable to delete the created reservation');
          }
          done();
        });
    });

    test('Should NOT allow past dates', done => {
      const invalidData = Object.assign({}, data);
      const time = new Date();
      time.setUTCHours(-24);
      invalidData.time = time.toISOString();

      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

    test('Should NOT allow future dates more than 1 year', done => {
      const invalidData = Object.assign({}, data);
      const time = new Date();
      time.setMonth(13);
      invalidData.time = time.toISOString();

      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

    test('Should NOT allow reservations on the off day', done => {
      const invalidData = Object.assign({}, data);
      const time = nextSunday(new Date().setUTCHours(12));
      invalidData.time = time.toISOString();

      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

    test('Should NOT allow reservations out of working hours', done => {
      const invalidData = Object.assign({}, data);
      const time = nextWednesday(new Date().setUTCHours(1));
      invalidData.time = time.toISOString();

      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

    test('Should NOT create reservation when invalid data posted', done => {
      const invalidData = Object.assign({}, data);
      const time = nextWednesday(new Date().setUTCHours(13));
      invalidData.time = time.toISOString();
      invalidData.phone = 'invalid phone number here';

      request(API).post('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

  });

  describe('Edit Reservation', () => {

    const data = {
      _id: "61d4b8308c8fa65750c50f66",
      tableId: "61dfb791e0205efb80f083ee",
      name: "edited reservation name",
      phone: "6927646161",
      time: nextTuesday(new Date().setUTCHours(13))
    };

    test('Should edit an existing reservation', done => {
      request(API).put('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(data)
        .end((err, res) => {
          expect(res.status).toBe(201);
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data).toBeDefined();
          expect(res.body.data.name).toBe(data.name);
          expect(res.body.data.phone).toBe(data.phone);
          done();
        });
    });

    test('Should be 400 Error when invalid data putted', done => {
      const invalidData = Object.assign({}, data);
      invalidData.phone = "invalid-phone-number-in-the-data";
      request(API).put('/api/restaurant/61d4b04efafc4eb99190c7c4/reservation')
        .set('Accept', 'application/json')
        .send(invalidData)
        .end((err, res) => {
          expect(res.status).toBe(422);
          expect(res.body.errors).toBeDefined();
          expect(res.body.data).toBeUndefined();
          done();
        });
    });

  });

});