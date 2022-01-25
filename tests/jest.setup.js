import mongoose from 'mongoose';
import mongooseConnect from '../src/commonlib/init/database.js';

beforeAll((done) => {
  mongooseConnect();
  done();
});

afterAll(async () => {
  await mongoose.connection.close();
});
