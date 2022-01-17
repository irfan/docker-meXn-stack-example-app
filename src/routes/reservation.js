import { Router } from 'express';
import log4js from 'log4js';
import { check, validationResult } from 'express-validator';

import Reservation from '../models/reservation.js';
import Restaurant from '../models/restaurant.js';
import RestaurantService from '../services/restaurant.js';
import { APIResponse } from '../lib/APIResponse.js';
import {
  paramMongoId,
  bodyMongoId,
  reservationTime,
  allowOnly
} from '../middleware/sanitizer.js';

const router = Router({ mergeParams: true });
const logger = log4js.getLogger();

export default (appRouter) => {

  appRouter.use('/restaurant/:restaurantId/reservation', router);

  router.post('/',
    allowOnly(['time', 'name', 'phone', 'tableId']),
    paramMongoId('restaurantId'),
    reservationTime('time'),
    bodyMongoId('tableId'),
    [
      check('name').isString(),
      check('phone').isString()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(errors);
        return res.status(400).json(errors);
      }

      const data = req.body;
      data.restaurantId = req.params.restaurantId;

      Restaurant.findById(data.restaurantId, 'workingHours tables')
        .then(restaurant => {
          const reservation = new Reservation(data);
          const service = new RestaurantService(restaurant);

          service.createReservation(reservation)
            .then(result => {
              res.status(201).json(new APIResponse(result));
            })
            .catch(e => {
              res.status(422).json(new APIResponse(e));
            });
        });

    });

  router.put('/',
    allowOnly(['_id', 'time', 'name', 'phone', 'tableId']),
    paramMongoId('restaurantId'),
    reservationTime('time'),
    bodyMongoId('_id'),
    bodyMongoId('tableId'),
    [
      check('name').isString(),
      check('phone').isString()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(errors);
        return res.status(400).json(errors);
      }

      const data = req.body;
      const restaurantId = req.params.restaurantId;
      data.restaurantId = restaurantId;

      Restaurant.findById(data.restaurantId, 'workingHours tables')
        .then(restaurant => {
          const reservation = new Reservation(data);
          const service = new RestaurantService(restaurant);

          service.updateReservation(reservation)
            .then(result => {
              res.status(201).json(new APIResponse(result));
            })
            .catch(e => {
              res.status(422).json(new APIResponse(e));
            });
        });
    });

  router.delete('/',
    allowOnly(['_id']),
    bodyMongoId('_id'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error(errors);
        return res.status(400).json(errors);
      }

      const id = req.body._id;
      const service = new RestaurantService();
      service.deleteReservation(id)
        .then(result => {
          if (!result) {
            throw new APIError('Unable to delete reservation', {_id:id})
          }
          res.status(204).json(new APIResponse(result));
        }).catch(e => {
          res.status(500).json(new APIResponse(e));
        });
    });
}
