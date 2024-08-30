import NotificationsCollection from '../models/notifications.js'; // Adjust path as needed

const markAllNotificationsRead = async (req, res) => {
  try {
    const { userId, role, classValue, indexNumber } = req.body; // Adjust how you get these values

    let updateCondition;

    if (role === 'Student') {
      updateCondition = { classValue, readBy: { $ne: userId } };
    } else if (role === 'Lecturer') {
      updateCondition = { lecturerIndexNumber: indexNumber, readBy: { $ne: userId } };
    } else if (role === 'Admin') {
      updateCondition = { readBy: { $ne: userId } };
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }

    await NotificationsCollection.updateMany(
      updateCondition,
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
}

export default markAllNotificationsRead;
