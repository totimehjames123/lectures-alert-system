import ScheduleCollection from '../models/schedules.js';
import usersCollection from '../models/users.js';
import sendEmailNotification from '../utils/sendEmailNotification.js';
import sendPushNotification from '../utils/sendPushNotification.js';
import logActivity from '../utils/logActivity.js'; // Adjust path as needed

const BATCH_SIZE = 5;

const processNotificationsInBatches = async (notifications) => {
  for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
    const batch = notifications.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(notification => {
      return notification.type === 'email'
        ? sendEmailNotification(notification.recipient, notification.title, notification.body)
        : sendPushNotification(notification.recipient, notification.title, notification.body, notification.lectureId);
    }));
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params; // Assuming lecture ID is passed as a route parameter

  try {
    // Find the lecture by ID
    const lecture = await ScheduleCollection.findById(id);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Delete the lecture
    await ScheduleCollection.findByIdAndDelete(id);

    // Log the activity with additional details
    await logActivity({
      action: 'Deleted',
      classValue: lecture.classValue,
      description: `Lecture for the Course: ${lecture.courseName} in class ${lecture.classValue}, scheduled on ${lecture.day}, from ${new Date(lecture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} to ${new Date(lecture.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} at ${lecture.venue} has been deleted.`,
      lectureId: lecture._id,
      lecturerIndexNumber: lecture.lecturerIndexNumber, // Add lectureIndexNumber
      lecturerName: lecture.lecturerName, // Add lectureName
      performedBy: req.user ? req.user.fullName : 'System', // Assuming req.user has the user's information
    }).catch(error => console.error('Error logging activity:', error)); // Handle logging errors

    // Notify students and lecturer
    const notifications = [];

    // Notify students in the same classValue
    const students = await usersCollection.find({ classValue: lecture.classValue, role: 'Student' });

    // Fetch the lecturer involved
    const lecturer = await usersCollection.findOne({ indexNumber: lecture.lecturerIndexNumber, role: 'Lecturer' });

    if (students.length > 0) {
      students.forEach(student => {
        const title = `Lecture Deleted`;
        const body = `Dear ${student.fullName}, the ${lecture.courseName} lecture scheduled for class ${lecture.classValue} on ${lecture.day} has been deleted.`;

        if (student.expoPushToken) {
          notifications.push({
            type: 'push',
            recipient: student.expoPushToken,
            title,
            body,
            lectureId: lecture._id
          });
        }

        notifications.push({
          type: 'email',
          recipient: student.email,
          title,
          body
        });
      });
    }

    // Notify the lecturer
    if (lecturer) {
      const lecturerTitle = `Lecture Deleted`;
      const lecturerBody = `Dear ${lecturer.fullName}, the lecture for the course ${lecture.courseName} in class ${lecture.classValue} scheduled on ${lecture.day} has been deleted.`;

      if (lecturer.expoPushToken) {
        notifications.push({
          type: 'push',
          recipient: lecturer.expoPushToken,
          title: lecturerTitle,
          body: lecturerBody,
          lectureId: lecture._id
        });
      }

      notifications.push({
        type: 'email',
        recipient: lecturer.email,
        title: lecturerTitle,
        body: lecturerBody
      });
    }

    // Process notifications in batches
    await processNotificationsInBatches(notifications);

    res.status(200).json({ message: 'Lecture deleted successfully, notifications are being processed' });

  } catch (error) {
    console.error('Error deleting lecture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteSchedule;
