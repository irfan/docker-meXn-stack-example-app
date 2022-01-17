import { Router } from 'express';
import log4js from 'log4js';

import Restaurant from '../models/restaurant.js';
import { paramMongoId } from '../middleware/sanitizer.js';
import { APIResponse } from '../lib/APIResponse.js';
import { APIError } from '../lib/APIError.js';

const logger = log4js.getLogger();
const router = Router();

export default (appRouter) => {

  appRouter.use('/restaurant', router);

  router.get('/:restaurantId',
    paramMongoId('restaurantId'),
    async (req, res) => {
      const restaurantId = req.params.restaurantId;

      Restaurant.findById(restaurantId).then(result => {
        if (!result) {
          throw new APIError('Invalid arguments!', { restaurantId });
        }
        res.status(200).json(new APIResponse(result));
      }).catch(e => {
        res.status(500).json(new APIResponse(e));
      });
    });
}

