import {Router} from 'express';

import restaurant from './restaurant.js';
import reservation from './reservation.js';
import settings from './settings.js';

/**
 * @return {Router}
 */
export default function routes() {
  const appRouter = new Router();

  restaurant(appRouter);
  settings(appRouter);
  reservation(appRouter);

  return appRouter;
}
