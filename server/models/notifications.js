import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['Scheduled', 'Postponed', 'Cancelled', 'Deleted', 'Other'], // You can add more actions as needed
  },
  classValue: {
    type: String,
    required: true, // Class for which the notification is relevant
  },
  description: {
    type: String,
    required: true, // Provide a description of the action
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule', // Reference to the schedule collection
    required: false, // Not always required
  },
  lecturerIndexNumber: {
    type: String, // Correct type for indexNumber
    required: false, 
  },
  lecturerName: {
    type: String, // Correct type for lectureName
    required: false, 
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the date of the action
  },

  performedBy: {
    type: String,
    required: true, // Who performed the action (e.g., admin, lecturer)
  },
  readBy: [{
    type: String, // Updated to handle list of strings
  }],
});

// Create a model based on schema
const NotificationsCollection = mongoose.model('Notification', notificationSchema);

export default NotificationsCollection;
