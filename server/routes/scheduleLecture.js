import ScheduleCollection from '../models/schedules.js';
import usersCollection from '../models/users.js';
import sendPushNotification from '../utils/sendPushNotification.js';
import sendEmailNotification from '../utils/sendEmailNotification.js';
import logActivity from '../utils/logActivity.js'; // Import the logActivity function

const BATCH_SIZE = 5; // Adjust batch size as needed

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

const scheduleLecture = async (req, res) => {
  const {
    lecturerName,
    lecturerIndexNumber,
    courseName,
    day,
    startTime,
    endTime,
    classValue,
    venue,
    comment,
  } = req.body;

  try {
    // Check if a lecture with the same course name and class already exists
    const existingLecture = await ScheduleCollection.findOne({
      courseName,
      classValue,
    });

    if (existingLecture) {
      return res.status(400).json({ message: 'A lecture with the same course name already exists for this class.' });
    }

    // Create a new lecture document
    const newLecture = new ScheduleCollection({
      lecturerName,
      lecturerIndexNumber,
      courseName,
      day,
      startTime,
      endTime,
      classValue,
      venue,
      comment,
      status: 'Scheduled', // Default status when scheduling a new lecture
    });

    // Save the lecture to the database
    const savedLecture = await newLecture.save();

    // Fetch all students in the class
    const students = await usersCollection.find({ classValue, role: 'Student' });

    // Fetch the lecturer involved
    const lecturer = await usersCollection.findOne({ indexNumber: lecturerIndexNumber, role: 'Lecturer' });

    // Prepare notifications
    const notifications = [];

    // Notify lecturer
    if (lecturer) {
      if (lecturer.expoPushToken) {
        notifications.push({
          type: 'push',
          recipient: lecturer.expoPushToken,
          title: `New Lecture Scheduled for ${courseName}`,
          body: `Hi ${lecturer.fullName}, a new lecture for ${courseName} in class ${classValue} has been scheduled on ${day} from ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} at ${venue}.`,
          lectureId: savedLecture._id
        });
      }

      notifications.push({
        type: 'email',
        recipient: lecturer.email,
        title: `New Lecture Scheduled for ${courseName}`,
        body: `Dear ${lecturer.fullName},\n\nA new lecture for ${courseName} in class ${classValue} has been scheduled.\n\nDetails:\n- Date: ${day}\n- Time: ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n- Venue: ${venue}\n\nBest Regards,\nYour University\n\n${comment ? `Note: ${comment}` : ''}`
      });
    }

    // Notify students
    for (const student of students) {
      if (student.expoPushToken) {
        notifications.push({
          type: 'push',
          recipient: student.expoPushToken,
          title: `New Lecture Scheduled for ${courseName}`,
          body: `Hi ${student.fullName}, a new lecture for ${courseName} in class ${classValue} has been scheduled on ${day} from ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} at ${venue}.`,
          lectureId: savedLecture._id
        });
      }

      notifications.push({
        type: 'email',
        recipient: student.email,
        title: `New Lecture Scheduled for ${courseName}`,
        body: `Dear ${student.fullName},\n\nA new lecture for ${courseName} in class ${classValue} has been scheduled.\n\nDetails:\n- Date: ${day}\n- Time: ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n- Venue: ${venue}\n\nBest Regards,\nYour University\n\n${comment ? `Note: ${comment}` : ''}`
      });
    }

    // Process notifications in batches
    processNotificationsInBatches(notifications).catch(error => console.error('Error sending notifications:', error));

    // Log the activity using logActivity with formatted time and additional details
    await logActivity({
      action: 'Scheduled',
      classValue,
      description: `Lecture scheduled for ${lecturerName} for the course ${courseName} in class ${classValue} on ${day} from ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} in ${venue}.${comment ? `\nNote: ${comment}` : ''}`,
      lectureId: savedLecture._id,
      lecturerName: lecturerName, // Add lectureName
      lecturerIndexNumber: lecturerIndexNumber , // Add lectureIndexNumber
      performedBy: 'Admin', // Assuming the lecturerName is the one performing the action
    }).catch(error => console.error('Error logging activity:', error));

    // Return a success response with the saved lecture
    res.status(201).json({ message: 'Lecture scheduled successfully', lecture: savedLecture });
  } catch (error) {
    console.error('Error scheduling lecture:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default scheduleLecture;
