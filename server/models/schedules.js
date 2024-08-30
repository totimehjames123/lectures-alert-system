import mongoose from 'mongoose';

// Define the schema
const scheduleSchema = new mongoose.Schema({
  lecturerName: {
    type: String,
    required: true,
  },
  lecturerIndexNumber: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  startTime: {
    type: String, // Changed from Date to String
    required: true,
  },
  endTime: {
    type: String, // Changed from Date to String
    required: true,
  },
  classValue: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Postponed', 'Cancelled'], // Status of the lecture
    default: 'Scheduled',
  },
  reason: {
    type: String,
    default: '', // Reason for postponement or cancellation, if applicable
  },
  rescheduledDate: {
    type: String, // Changed from Date to String
    default: null, // New date for postponed lecture, if applicable
  },
  comment: {
    type: String,
    default: '', // Optional additional information
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model based on the schema
const ScheduleCollection = mongoose.model('Schedule', scheduleSchema);

export default ScheduleCollection;
