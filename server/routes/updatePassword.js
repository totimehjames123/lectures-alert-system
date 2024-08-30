// Import necessary modules
import bcrypt from 'bcrypt';
import usersCollection from '../models/users.js'; // Adjust path as per your project structure

// Route to update user's password
const updatePassword = async (req, res) => {
    const { indexNumber, currentPassword, newPassword } = req.body;

    try {
        // Find user by index number
        const user = await usersCollection.findOne({ indexNumber: indexNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the saltRounds

        // Update user's password
        user.password = hashedPassword;

        // Save the updated user object
        await user.save();

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default updatePassword;
