import usersCollection from '../models/users.js';
import ScheduleCollection from '../models/schedules.js';
import sendEmailNotification from './sendEmailNotification.js';

const checkAndSendNotifications = async () => {
    try {
        // Get current date and time
        const now = new Date(); 
        // await sendEmailNotification("totimehjames123@gmail.com", "some", "someone")
        // Strip seconds and milliseconds from the current time for more flexible comparison
        const nowStripped = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
        console.log(nowStripped)
        // Find upcoming lectures
        const upcomingLectures = await ScheduleCollection.find({
            $or: [
                { status: 'Scheduled', day: { $gte: now.toISOString().split('T')[0] } }, 
                { status: 'Postponed', rescheduledDate: { $gte: now.toISOString().split('T')[0] } }
            ]
        });

        // Process each lecture
        for (const lecture of upcomingLectures) {
            // Extract date and time parts
            const lectureDate = new Date(`${lecture.day}T${lecture.startTime}`);
            const lectureRescheduledDate = lecture.status === 'Postponed' ? new Date(`${lecture.rescheduledDate}T${lecture.startTime}`) : null;

            // Strip seconds and milliseconds from the lecture times for more flexible comparison
            const lectureDateStripped = new Date(lectureDate.getFullYear(), lectureDate.getMonth(), lectureDate.getDate(), lectureDate.getHours(), lectureDate.getMinutes());
            const lectureRescheduledDateStripped = lectureRescheduledDate ? new Date(lectureRescheduledDate.getFullYear(), lectureRescheduledDate.getMonth(), lectureRescheduledDate.getDate(), lectureRescheduledDate.getHours(), lectureRescheduledDate.getMinutes()) : null;

            // Find the students and lecturers
            const students = await usersCollection.find({ role: 'Student', classValue: lecture.classValue });
            const lecturers = await usersCollection.find({ role: 'Lecturer', indexNumber: lecture.lecturerIndexNumber });

            if (lecture.status === 'Scheduled') {
                // Notification 3 days before the lecture
                const notify3DaysBefore = new Date(lectureDateStripped);
                notify3DaysBefore.setDate(notify3DaysBefore.getDate() - 3);
                if (nowStripped.toDateString() === notify3DaysBefore.toDateString()) {
                    const message = `Reminder: Your lecture is in 3 days. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Reminder', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Reminder', message));
                }

                // Notification 2 days before the lecture
                const notify2DaysBefore = new Date(lectureDateStripped);
                notify2DaysBefore.setDate(notify2DaysBefore.getDate() - 2);
                if (nowStripped.toDateString() === notify2DaysBefore.toDateString()) {
                    const message = `Reminder: Your lecture is in 2 days. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Reminder', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Reminder', message));
                }

                // Notification 1 day before the lecture
                const notify1DayBefore = new Date(lectureDateStripped);
                notify1DayBefore.setDate(notify1DayBefore.getDate() - 1);
                if (nowStripped.toDateString() === notify1DayBefore.toDateString()) {
                    const message = `Reminder: Your lecture is tomorrow. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Reminder', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Reminder', message));
                }

                // Notification 1 hour before the lecture
                const notify1HourBefore = new Date(lectureDateStripped);
                notify1HourBefore.setHours(notify1HourBefore.getHours() - 1);
                if (nowStripped.toDateString() === notify1HourBefore.toDateString() &&
                    nowStripped.getTime() === notify1HourBefore.getTime()) {
                    const message = `Reminder: Your lecture is starting in 1 hour. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Starting Soon', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Starting Soon', message));
                }

                // Notification 5 minutes before the lecture
                const notify5MinutesBefore = new Date(lectureDateStripped);
                notify5MinutesBefore.setMinutes(notify5MinutesBefore.getMinutes() - 5);
                if (nowStripped.toDateString() === notify5MinutesBefore.toDateString() &&
                    nowStripped.getTime() === notify5MinutesBefore.getTime()) {
                    const message = `Reminder: Your lecture is starting in 5 minutes. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Starting Soon', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Starting Soon', message));
                }

                // Notification 1 minute before the lecture
                const notify1MinuteBefore = new Date(lectureDateStripped);
                console.log("sdfk")
                notify1MinuteBefore.setMinutes(notify1MinuteBefore.getMinutes() - 1);
                if (nowStripped.toDateString() === notify1MinuteBefore.toDateString() &&
                    nowStripped.getTime() === notify1MinuteBefore.getTime()) {
                    const message = `Reminder: Your lecture is starting in 1 minute. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Starting Soon', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Starting Soon', message));
                }

                // Notification exactly at the start time
                if (nowStripped.toDateString() === lectureDateStripped.toDateString() &&
                    nowStripped.getTime() === lectureDateStripped.getTime()) {
                    const message = `The lecture on ${lecture.day} has started. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Started', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Started', message));
                }
            } else if (lecture.status === 'Postponed') {
                // Notifications based on rescheduledDate
                if (lectureRescheduledDateStripped && nowStripped.toDateString() === lectureRescheduledDateStripped.toDateString()) {
                    const message = `The lecture originally scheduled for ${lecture.day} has been postponed to ${lecture.rescheduledDate}. Course: ${lecture.courseName}, Lecturer: ${lecture.lecturerName}, Venue: ${lecture.venue}, Class: ${lecture.classValue}.`;
                    console.log(message)
                    students.forEach(student => sendEmailNotification(student.email, 'Lecture Postponed', message));
                    lecturers.forEach(lecturer => sendEmailNotification(lecturer.email, 'Lecture Postponed', message));
                }
            }
        }
    } catch (error) {
        console.error('Error checking and sending notifications:', error);
    }
};

export default checkAndSendNotifications;
