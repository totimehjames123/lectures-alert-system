// utils/getLecturers.js

import axios from 'axios';

export const getLecturers = async () => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
    const allUsers = response?.data?.users;

    // Filter only lecturers 
    const lecturers = allUsers?.filter(user => user.role === 'Lecturer');

    return lecturers;
  } catch (error) {
    // console.error('Error fetching lecturers:', error);
    throw error;
  }
};
