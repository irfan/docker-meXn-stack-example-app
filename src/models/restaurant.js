import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const WorkingHours = new mongoose.Schema({
  hour: {
    type: Number,
    required: [true, 'Opening hour is mandatory'],
    min:0,
    max:23
  },
  day: {
    type: Number,
    required: [true, 'Day of the week is mandatory'],
    min:0,
    max:6
  },
  duration: {
    type: Number,
    min: 60,
    max: 1440
  },
  open: {
    type: Boolean
  }
}, { _id: false });


const Tables = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name field required!']
  },
  smoking: {
    type: Boolean
  },
  outdoor: {
    type: Boolean
  },
  floor: {
    type: Number,
    required: false,
    default: 0
  }
},
{
  _id: true,
  timestamps: true
});


const Restaurant = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a restaurant name']
  },
  phone: {
    type: String,
    required: [true, 'Please enter a valid contact number']
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  address: String,
  workingHours: {
    type: [WorkingHours],
    required: false
  },
  tables: {
    type: [Tables],
    required: false
  }
},
{
  collection: 'restaurants',
  timestamps: true,
  versionKey: false
});

export default mongoose.model('Restaurant', Restaurant);
