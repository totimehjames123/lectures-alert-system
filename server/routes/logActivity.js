import NotificationsCollection from '../models/notifications.js'; // Adjust path as needed

const logActivity = async (req, res) => {
  const { action, description, lectureId, performedBy } = req.body;

  try {
    // Create a new notification entry
    const notification = new NotificationsCollection({
      action,
      description,
      lectureId,
      performedBy,
    });

    // Save the notification to the database
    const savedNotification = await notification.save();

    res.status(201).json({ message: 'Activity logged successfully', notification: savedNotification });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default logActivity;
