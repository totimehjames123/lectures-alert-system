import usersCollection from '../models/users.js'; // Adjust path as per your project structure

// allUsers route excluding 'admin' role
const allUsers = async (req, res) => {
  try {
    // Fetch all users except those with the 'Admin' role
    const users = await usersCollection.find({ role: { $ne: 'Admin' } });
    
    // Return the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default allUsers;
