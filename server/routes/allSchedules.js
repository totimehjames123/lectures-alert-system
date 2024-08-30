import ScheduleCollection from '../models/schedules.js';
import usersCollection from '../models/users.js';

const allSchedules = async (req, res) => {
  const { role, classValue, lecturerIndexNumber } = req.query;

  try {
    let schedules;

    if (role === 'Admin') {
      // Fetch all schedules for Admin
      schedules = await ScheduleCollection.find({});
    } else if (role === 'Student') {
      // Fetch schedules for Student where classValue matches
      schedules = await ScheduleCollection.find({ classValue });
    } else if (role === 'Lecturer') {
      // Fetch schedules for Lecturer where lecturerIndexNumber matches
      schedules = await ScheduleCollection.find({ lecturerIndexNumber });
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    return res.status(200).json(schedules); 
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default allSchedules;
