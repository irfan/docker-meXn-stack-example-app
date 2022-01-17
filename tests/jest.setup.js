import mongoose from 'mongoose';
import mongooseConnect from '../src/init/database.js';

beforeAll(done => {
  mongooseConnect();
  done();
});

afterAll(done => {
  mongoose.connection.close();
  done();
});
