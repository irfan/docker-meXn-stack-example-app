import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const Reservation = new mongoose.Schema({
  restaurantId: {
    type: ObjectId,
    required: [true, 'Restaurant is required'],
    ref: 'Restaurant'
  },
  name: {
    type: String,
    required: [true, 'Please enter a name for the reservation']
  },
  phone: {
    type: String,
    required: [true, 'Please enter a valid contact number']
  },
  time: {
    type: String,
    required: [true, 'Please enter time']
  },
  tableId: {
    type: ObjectId,
    required: [true, 'Table is required']
  },
  people: {
    type: Number,
    required: [true, 'People is required!']
  }
},
{
  collection: 'reservations',
  timestamps: true,
  versionKey: false
});


export default mongoose.model('Reservation', Reservation);
