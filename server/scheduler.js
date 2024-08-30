import cron from 'node-cron';
import connectDB from './config.js';
import checkAndSendNotifications from './utils/checkAndSendNotifications.js';

// Ensure DB connection is established
connectDB.then(() => {
    // Run the function every minute using cron
    cron.schedule('* * * * * ', () => {
        console.log('Running checkAndSendNotifications every minute...');
        checkAndSendNotifications();
    }, {
        scheduled: true,
        timezone: "Africa/Accra" // Ghana's timezone
    });

    console.log('Notification scheduler is running every minute...'); 
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
