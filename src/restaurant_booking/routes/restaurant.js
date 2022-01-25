import {Router} from 'express';
import {validationResult} from 'express-validator';
import ReservationService from '../services/reservation.js';
import Restaurant from '../../commonlib/models/restaurant.js';
import {paramMongoId, paramDate} from '../../commonlib/validators/sanitizer.js';
import {APIResponse} from '../../commonlib/lib/APIResponse.js';
import log4js from 'log4js';

const logger = log4js.getLogger();
const router = new Router();

export default (appRouter) => {
  appRouter.use('/restaurant', router);

  router.get('/:restaurantId/:reservationDate',
      paramMongoId('restaurantId'),
      paramDate('reservationDate'),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.error(errors);
          return res.status(400).json(errors);
        }

        const restaurantId = req.params.restaurantId;
        const reservationDate = new Date(req.params.reservationDate);

        Restaurant.findById(restaurantId).lean().then((result) => {
          const service = new ReservationService(result);
          service.getAvailabilityByDate(reservationDate).then((response) => {
            res.status(200).json(new APIResponse(response));
          }).catch((e) => {
            res.status(400).json(new APIResponse(e));
          });
        }).catch((e) => {
          res.status(500).json(new APIResponse(e));
        });
      });
};

