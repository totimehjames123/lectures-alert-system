// Fetch all students
export const getStudents = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
      const allUsers = response?.data?.users;
  
      // Filter only students
      const students = allUsers?.filter(user => user.role === 'Student');
  
      return students.length; // Return the count of students
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };