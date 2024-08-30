import NotificationsCollection from '../models/notifications.js'; // Adjust path as needed

const allNotifications = async (req, res) => {
  const { role, classValue, indexNumber } = req.query;

  try {
    let notifications;

    if (role === 'Admin') {
      // Admin should see all notifications
      notifications = await NotificationsCollection.find().sort({ date: -1 }); // Sort by date, most recent first
    } else if (role === 'Student') {
      // Students see only notifications relevant to their classValue
      notifications = await NotificationsCollection.find({ classValue }).sort({ date: -1 });
    } else if (role === 'Lecturer') {
      // Lecturers see only notifications relevant to their indexNumber
      notifications = await NotificationsCollection.find({ lecturerIndexNumber: indexNumber }).sort({ date: -1 });
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default allNotifications;
