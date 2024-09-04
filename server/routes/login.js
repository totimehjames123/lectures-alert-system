import bcrypt from 'bcrypt';
import usersCollection from '../models/users.js'; // Adjust the path as per your project structure

// Login route
export const login = async (req, res) => {
  const { indexNumber, password, expoPushToken } = req.body;

  try {
    // Find user by indexNumber
    const user = await usersCollection.findOne({ indexNumber });

    if (!user) {
      return res.status(404).json({ message: 'Invalid username or password!' });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password!' });
    }

    if (!expoPushToken){
      return res.status(400).json({ message: 'No token credentials' });
    }
    // If expoPushToken is provided, update it in the database
    if (expoPushToken) {
      await usersCollection.findOneAndUpdate(
        { indexNumber },
        { expoPushToken },
        { new: true }
      );
    }

    // If successful, return user details
    return res.status(200).json({
      message: 'Login successful!',
      user: {
        _id: user._id,
        indexNumber: user.indexNumber,
        fullName: user.fullName,
        contact: user.contact,
        classValue: user.classValue,
        email: user.email, 
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default login;
