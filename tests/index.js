import request from 'supertest';
import express from 'express';
import initApp from '../src/init/express.js';

// init the express app for testing
const expressApp = express();
const app = await initApp(expressApp);

export default app;
