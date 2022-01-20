import mongoose from 'mongoose';
import mongooseConnect from '../src/booking_manager/init/database.js';

beforeAll(done => {
  mongooseConnect();
  done();
});

afterAll(async () => {
  const closed = await mongoose.connection.close();
});
