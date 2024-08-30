// Import necessary modules
import usersCollection from '../models/users.js'; // Adjust path as per your project structure
import bcrypt from 'bcrypt';

// Reset Password route
export const resetPassword = async (req, res) => {
    const { indexNumber, resetToken, email, newPassword } = req.body;

    try {
        // Find user by indexNumber, reset token, and email; check if the token is not expired
        const user = await usersCollection.findOne({
            indexNumber,
            email,
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() } // Check if the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token, index number, or email' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the saltRounds

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default resetPassword;
