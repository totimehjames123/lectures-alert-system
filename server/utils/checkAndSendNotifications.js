import usersCollection from '../models/users.js';
import ScheduleCollection from '../models/schedules.js';
import sendEmailNotification from './sendEmailNotification.js';
import sendPushNotification from './sendPushNotification.js'; // Import your push notification function

const checkAndSendNotifications = async () => {
    try {
        console.log("Checking for upcoming lectures...");

        // Find all lectures
        const upcomingLectures = await ScheduleCollection.find();
        console.log('Upcoming Lectures:', upcomingLectures);

        if (upcomingLectures.length === 0) {
            console.log('No lectures found in the database.');
            return; // No lectures to process
        }

        // Process each lecture
        for (const lecture of upcomingLectures) {
            // Find the students and lecturers
            const students = await usersCollection.find({ role: 'Student', classValue: lecture.classValue });
            const lecturers = await usersCollection.find({ role: 'Lecturer', indexNumber: lecture.lecturerIndexNumber });

            console.log(`Processing lecture: ${lecture._id}`);

            // Notification logic based on the lecture status
            const emailSubject = lecture.status === 'Scheduled' ? 'Lecture Reminder' : 'Lecture Postponed';
            const emailBody = lecture.status === 'Scheduled'
                ? `Reminder: Your lecture is scheduled for ${lecture.day}. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`
                : `Notice: The lecture originally scheduled for ${lecture.day} has been postponed to ${lecture.rescheduledDate}. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;

            const pushNotificationBody = emailBody; // Use the same body for push notifications

            // Send email notifications
            students.forEach(student => sendEmailNotification(student.email, emailSubject, emailBody));
            lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, emailSubject, emailBody));

            // Send push notifications if push tokens are available
            for (const student of students) {
                if (student.expoPushToken) {
                    await sendPushNotification(student.expoPushToken, emailSubject, pushNotificationBody, lecture._id);
                }
            }

            for (const lecturer of lecturers) {
                if (lecturer.expoPushToken) {
                    await sendPushNotification(lecturer.expoPushToken, emailSubject, pushNotificationBody, lecture._id);
                }
            }
        }
    } catch (error) {
        console.error('Error checking and sending notifications:', error);
    }
};

export default checkAndSendNotifications;
