import cron from 'node-cron';
import connectDB from './config.js';
import checkAndSendNotifications from './utils/checkAndSendNotifications.js';

// Ensure DB connection is established
connectDB.then(() => {
    // Schedule the function to run every day at 6:00 AM
    cron.schedule('0 6 * * *', () => {
        console.log('Running checkAndSendNotifications every day at 6:00 AM...');
        checkAndSendNotifications();
    }, {
        scheduled: true,
        timezone: "Africa/Accra" // Ghana's timezone
    });

    // Schedule the function to run every day at 6:00 PM
    cron.schedule('0 18 * * *', () => {
        console.log('Running checkAndSendNotifications every day at 6:00 PM...');
        checkAndSendNotifications();
    }, {
        scheduled: true,
        timezone: "Africa/Accra" // Ghana's timezone
    });

    console.log('Notification scheduler is set to run daily at 6:00 AM and 6:00 PM...'); 
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
