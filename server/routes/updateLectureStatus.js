import ScheduleCollection from '../models/schedules.js';
import usersCollection from '../models/users.js';
import sendEmailNotification from '../utils/sendEmailNotification.js';
import sendPushNotification from '../utils/sendPushNotification.js';
import logActivity from '../utils/logActivity.js'; // Adjust path as needed

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

const updateLectureStatus = async (req, res) => {
  const { id } = req.params; // Assuming lecture ID is passed as a route parameter
  const { status, reason, rescheduledDate } = req.body;

  try {
    // Find the lecture by ID
    const lecture = await ScheduleCollection.findById(id);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }

    // Update the lecture status and other relevant fields
    lecture.status = status;

    if (status === 'Postponed') {
      lecture.reason = reason || '';
      lecture.rescheduledDate = rescheduledDate;
    } else if (status === 'Cancelled') {
      lecture.reason = reason || '';
      lecture.rescheduledDate = null; // Clear rescheduled date if canceled
    } else if (status === 'Scheduled') {
      lecture.reason = '';
      lecture.rescheduledDate = null;
    }

    const updatedLecture = await lecture.save();

    // Format the rescheduled date for display
    const formattedRescheduledDate = rescheduledDate ? new Date(rescheduledDate).toLocaleDateString() : '';

    // Log the activity
    await logActivity({
      action: status,
      classValue: lecture.classValue,
      description: `Lecture has been ${status.toLowerCase()} by Lecturer ${lecture.lecturerName} for the Course: ${lecture.courseName} in class ${lecture.classValue}, which was originally scheduled for ${lecture.day}, from ${new Date(lecture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} to ${new Date(lecture.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} at ${lecture.venue}.${lecture.reason ? `\nReason: ${lecture.reason}` : ''}${status === 'Postponed' ? ` The New Date for this lecture is: ${formattedRescheduledDate}` : ''}`,
      lectureId: lecture._id,
      lecturerName: lecture.lecturerName,
      lecturerIndexNumber: lecture.lecturerIndexNumber,
      performedBy: req.user ? req.user.fullName : 'System', // Assuming req.user has the user's information
    });

    // Notify students in the same classValue
    const students = await usersCollection.find({ classValue: lecture.classValue, role: 'Student' });

    // Fetch the lecturer involved
    const lecturer = await usersCollection.findOne({ indexNumber: lecture.lecturerIndexNumber, role: 'Lecturer' });

    // Prepare notifications
    const notifications = [];

    // Notify students
    if (students.length > 0) {
      students.forEach(student => {
        const title = `Lecture ${status} - Class ${lecture.classValue}`;
        let body = `Dear ${student.fullName}, your ${lecture.courseName} lecture scheduled on ${lecture.day} in class ${lecture.classValue} has been ${status.toLowerCase()}.`;

        if (status === 'Postponed') {
          body += ` The new date is ${formattedRescheduledDate}. ${lecture.reason ? `Reason: ${lecture.reason}.` : ''}`;
        } else if (status === 'Cancelled') {
          body += ` ${lecture.reason ? `Reason: ${lecture.reason}.` : ''}`;
        }

        // Send push notification
        if (student.expoPushToken) {
          notifications.push({
            type: 'push',
            recipient: student.expoPushToken,
            title,
            body,
            lectureId: lecture._id
          });
        }

        // Send email notification
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
      const lecturerTitle = `Lecture ${status} - Class ${lecture.classValue}`;
      let lecturerBody = `Dear ${lecturer.fullName}, the lecture for the course ${lecture.courseName} in class ${lecture.classValue} scheduled on ${lecture.day} has been ${status.toLowerCase()}.`;

      if (status === 'Postponed') {
        lecturerBody += ` The new date is ${formattedRescheduledDate}. ${lecture.reason ? `Reason: ${lecture.reason}.` : ''}`;
      } else if (status === 'Cancelled') {
        lecturerBody += ` ${lecture.reason ? `Reason: ${lecture.reason}.` : ''}`;
      }

      // Send push notification to lecturer
      if (lecturer.expoPushToken) {
        notifications.push({
          type: 'push',
          recipient: lecturer.expoPushToken,
          title: lecturerTitle,
          body: lecturerBody,
          lectureId: lecture._id
        });
      }

      // Send email notification to lecturer
      notifications.push({
        type: 'email',
        recipient: lecturer.email,
        title: lecturerTitle,
        body: lecturerBody
      });
    }

    // Process notifications in batches
    await processNotificationsInBatches(notifications);

    res.status(200).json({ message: 'Lecture status updated successfully, notifications sent, and activity logged', lecture: updatedLecture });
  } catch (error) {
    console.error('Error updating lecture status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateLectureStatus;
