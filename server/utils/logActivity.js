import NotificationsCollection from '../models/notifications.js'; // Adjust path as needed

/**
 * Logs an activity to the NotificationsCollection.
 * 
 * @param {Object} params - Parameters for logging the activity.
 * @param {string} params.action - The type of action performed (e.g., 'Scheduled', 'Postponed').
 * @param {string} params.classValue - The class for which the action is relevant.
 * @param {string} params.description - A description of the action performed.
 * @param {string} [params.lectureId] - The ID of the lecture associated with the action (optional).
 * @param {string} [params.lecturerIndexNumber] - The index number of the lecture (optional).
 * @param {string} [params.lecturerName] - The name of the lecture (optional).
 * @param {string} params.performedBy - The user who performed the action.
 * @param {Array<string>} [params.readBy] - An array of user IDs who have read the notification (optional).
 * 
 * @returns {Promise<Object>} - Returns the saved notification.
 */
const logActivity = async ({ action, classValue, description, lectureId, lecturerIndexNumber, lecturerName, performedBy, readBy = [] }) => {
  try {
    // Create a new notification entry
    const notification = new NotificationsCollection({
      action,
      classValue,
      description,
      lectureId,
      lecturerIndexNumber,
      lecturerName,
      performedBy,
      readBy,
    });

    // Save the notification to the database
    const savedNotification = await notification.save();
    console.log(savedNotification)
    // Return the saved notification for further use
    return savedNotification;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw new Error('Could not log activity');
  }
};

export default logActivity;
