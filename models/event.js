import { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  event: {
    type: String,
    required: [true, 'Event name is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
  date: {
    type: Date,
    required: [true, 'Date of the event is required.'],
  },
  time: {
    type: String,
    required: [true, 'Time of the event is required.'],
  },
  location: {
    type: String,
    required: [true, 'Location is required.'],
  },
  attire: {
    type: String,
    required: [true, 'Attire is required.'],
  },
  guestListCount: {
    type: Number,
    required: [true, 'Guest List count is required.'],
  }
});

const Event = models.Event || model('Event', EventSchema);

export default Event;