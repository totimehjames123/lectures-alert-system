import express from 'express'
import bodyParser  from 'body-parser';
import connectDB  from './config.js'
import cors from 'cors'


import addUser from './routes/addUser.js';
import allUsers from './routes/allUsers.js';
import login from './routes/login.js';
import forgotPassword from './routes/forgotPassword.js';
import resetPassword from './routes/resetPassword.js';
import updatePassword from './routes/updatePassword.js';
import updateProfile from './routes/updateProfile.js'; 
import scheduleLecture from './routes/scheduleLecture.js';
import updateLectureStatus from './routes/updateLectureStatus.js';
import deleteSchedule from './routes/deleteSchedule.js';
import logActivity from './routes/logActivity.js';
import verifyUser from './routes/verifyUser.js';
import allSchedules from './routes/allSchedules.js';
import deleteUser from './routes/deleteUser.js';
import allNotifications from './routes/allNotifications.js';
import markAllNotificationsRead from './routes/markAllNotificationsRead.js';

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Routes 
app.get("/", (req, res) => {
    return res.status(200).json({ message: 'Hello from Lecture alert system' });
})
app.post("/add-user", addUser)
app.get("/all-users", allUsers)
app.post("/login", login)
app.post("/verify-user", verifyUser)
app.delete("/delete-user/:indexNumber", deleteUser)   
app.post("/forgot-password", forgotPassword)
app.post("/reset-password", resetPassword)
app.post("/update-password", updatePassword) 
app.put("/update-profile/:indexNumber", updateProfile)
app.post('/schedule-lecture', scheduleLecture);
app.post('/log-activity', logActivity);
app.get('/all-notifications', allNotifications);
app.put('/update-lecture-status/:id', updateLectureStatus);
app.delete('/delete-schedule/:id', deleteSchedule);
app.get('/all-schedules', allSchedules);
app.post('/mark-all-notifications-read', markAllNotificationsRead)


// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});