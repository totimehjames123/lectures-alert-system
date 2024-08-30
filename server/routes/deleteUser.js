import usersCollection from '../models/users.js'; // Adjust path as per your project structure

// deleteUser route
const deleteUser = async (req, res) => {
  const { indexNumber } = req.params;

  try {
    // Find the user by indexNumber and delete them
    const deletedUser = await usersCollection.findOneAndDelete({ indexNumber });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteUser;
