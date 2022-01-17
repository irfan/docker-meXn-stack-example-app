import express from 'express';
import cors from 'cors';

import config from '../config/index.js';
import routes from '../routes/index.js';
import log4js from 'log4js';

const logger = log4js.getLogger();

export default async (app) => {

  app.use(express.json());
  app.use(cors());

  app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.debug(`${ip} ${req.method} ${req.path}`);
    next();
  });

  app.use(config.servePath, routes());

  app.use('/', (req, res) => {
    res.status(200).send(`
    See <a href="https://github.com/irfan/docker-meXn-stack-example-app">github repo</a>
    for details.<br />
  `);
  })

  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
      'errors': [{
        msg: 'Whops! Somthing went wrong'
      }]});
  });

  return app;
}
