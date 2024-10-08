import usersCollection from '../models/users.js';
import sendPushNotification from '../utils/sendPushNotification.js';
import sendEmailNotification from '../utils/sendEmailNotification.js';
import sendSMSNotification from '../utils/sendSMSNotification.js'; 
import logActivity from '../utils/logActivity.js';

const BATCH_SIZE = 5;

const processNotificationsInBatches = async (notifications) => {
  for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
    const batch = notifications.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(notification => {
      if (notification.type === 'email') {
        return sendEmailNotification(notification.recipient, notification.title, notification.body);
      } else if (notification.type === 'push') {
        return sendPushNotification(notification.recipient, notification.title, notification.body, notification.lectureId);
      } else if (notification.type === 'sms') {
        return sendSMSNotification(notification.recipient, notification.body); // Use sendSMSNotification
      }
    }));
  }
};

const sendCustomNotification = async (req, res) => {
  const { classValue, lecturerName, lecturerIndexNumber, message } = req.body;

  try {
    // Step 1: Fetch all students in the specified class
    const students = await usersCollection.find({
      classValue: classValue,
      role: 'Student'
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the specified class.' });
    }

    // Create notification list
    const notifications = [];

    students.forEach(student => {
      // Add email notification
      notifications.push({
        type: 'email',
        recipient: student.email,
        title: `Notification from Lecturer ${lecturerName}`,
        body: message
      });

      // Add push notification if expoPushToken exists
      if (student.expoPushToken) {
        notifications.push({
          type: 'push',
          recipient: student.expoPushToken,
          title: `Notification from Lecturer ${lecturerName}`,
          body: message,
          lectureId: lecturerIndexNumber
        });
      }

      // Add SMS notification if phone number exists
      if (student.phoneNumber) {
        notifications.push({
          type: 'sms',
          recipient: student.phoneNumber,
          body: message
        });
      }
    });

    // Step 2: Send notifications in batches
    processNotificationsInBatches(notifications)
      .then(() => {
        // Step 3: Log the notification
        const notificationDetails = {
          action: 'Other',
          classValue: classValue,
          description: `Message from ${lecturerName}: ` + message,
          lecturerIndexNumber,
          lecturerName,
          performedBy: lecturerName
        };

        return logActivity(notificationDetails);
      })
      .then(() => {
        // Respond to the client
        res.status(200).json({ message: 'Notifications sent successfully.' });
      })
      .catch(error => {
        console.error('Error sending notifications:', error);
        res.status(500).json({ message: 'An error occurred while sending notifications.' });
      });

  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'An error occurred while sending notifications.' });
  }
};

export default sendCustomNotification;
