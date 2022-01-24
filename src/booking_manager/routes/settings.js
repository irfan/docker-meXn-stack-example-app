import {Router} from 'express';
import {body, check, validationResult} from 'express-validator';
import log4js from 'log4js';
import RestaurantService from '../services/restaurant.js';
import {APIResponse} from '../../commonlib/lib/APIResponse.js';
import {APIError} from '../../commonlib/lib/APIError.js';

import {
  bodyMongoId,
  paramMongoId,
  allowOnly,
  allowArrayOnly,
} from '../../commonlib/validators/sanitizer.js';

const logger = log4js.getLogger();
const router = new Router({mergeParams: true});

export default (appRouter) => {
  appRouter.use('/restaurant/:restaurantId/settings', router);

  router.put('/working-hours',
      paramMongoId('restaurantId'),
      allowArrayOnly(['hour', 'day', 'duration', 'open'], {min: 7, max: 7}),
      [
        body('*.hour').trim().isInt().toInt(),
        body('*.day').trim().isInt().toInt(),
        body('*.duration').trim().isInt().toInt(),
        body('*.open').isBoolean(),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.error(errors);
          return res.status(400).json(errors);
        }

        const data = req.body;
        const restaurantId = req.params.restaurantId;

        const service = new RestaurantService();
        service.updateWorkingHours(restaurantId, data)
            .then((result) => {
              if (!result) {
                throw new APIError('Invalid working hours!', data);
              }
              res.status(201).json(new APIResponse(result.workingHours));
            }).catch((e) => {
              res.status(500).json(new APIResponse(e));
            });
      });

  router.post('/tables',
      paramMongoId('restaurantId'),
      allowOnly(['name', 'smoking', 'outdoor', 'floor', 'seat']),
      [
        check('seat').isInt(),
        check('name').isString(),
        check('smoking').isBoolean(),
        check('outdoor').isBoolean(),
        check('floor').isInt(),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.error(errors);
          return res.status(400).json(errors);
        }
        const restaurantId = req.params.restaurantId;
        const table = req.body;

        const service = new RestaurantService();
        service.addTable(restaurantId, table)
            .then((result) => {
              if (!result) {
                throw new APIError('Invalid table data!', table);
              }
              const createdTable = result.tables.find(
                  (t) => t.name == table.name,
              );
              createdTable.restaurantId = result._id;
              res.status(201).json(new APIResponse(createdTable));
            }).catch((e) => {
              res.status(500).json(new APIResponse(e));
            });
      });

  router.put('/tables',
      paramMongoId('restaurantId'),
      bodyMongoId('_id'),
      allowOnly(['_id', 'name', 'smoking', 'outdoor', 'floor', 'seat']),
      [
        check('seat').isInt(),
        check('name').isString(),
        check('smoking').isBoolean(),
        check('outdoor').isBoolean(),
        check('floor').isInt(),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          logger.error(errors);
          return res.status(400).json(errors);
        }
        const restaurantId = req.params.restaurantId;
        const table = req.body;

        const service = new RestaurantService();
        service.updateTable(restaurantId, table)
            .then((result) => {
              if (!result) {
                throw new APIError('Invalid table data!', table);
              }
              const updatedTable = result.tables.find((i) => i._id = table._id);
              res.status(201).json(new APIResponse(updatedTable));
            })
            .catch((e) => {
              res.status(500).json(new APIResponse(e));
            });
      });
};
