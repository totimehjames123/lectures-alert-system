// Import necessary modules
import usersCollection from '../models/users.js'; // Adjust path as per your project structure

// PUT endpoint to update user profile
const updateProfile = async (req, res) => {
  const indexNumber = req.params.indexNumber; // Assuming indexNumber is passed as a route parameter

  const { fullName, email, contact, classValue, role } = req.body;

  try {
    // Find the user by indexNumber
    const user = await usersCollection.findOne({ indexNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user fields
    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.email = email !== undefined ? email : user.email;
    user.contact = contact !== undefined ? contact : user.contact;
    user.classValue = role === 'Student' ? (classValue !== undefined ? classValue : user.classValue) : user.classValue;
    user.role = role !== undefined ? role : user.role;

    // Save updated user to MongoDB
    const updatedUser = await user.save();

    res.json(updatedUser); // Respond with the updated user object
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update user profile.', details: err.message });
  }
};

export default updateProfile;
