import {Router} from 'express';
import restaurant from './restaurant.js';

/**
 * @return {Router}
 */
export default function routes() {
  const appRouter = new Router();

  restaurant(appRouter);

  return appRouter;
}
