// Import necessary modules
import usersCollection from '../models/users.js'; // Adjust path as per your project structure
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Forgot Password route
export const forgotPassword = async (req, res) => {
    const { indexNumber, email } = req.body;

    try {
        // Check if user with the provided email and indexNumber exists
        const user = await usersCollection.findOne({ indexNumber, email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email or index number' });
        }

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save the verification code and its expiration time to the user document
        user.resetPasswordToken = verificationCode;
        user.resetPasswordExpires = Date.now() + 3600000; // Code expires in 1 hour

        await user.save();

        // Send password reset email with the verification code
        const transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USERNAME,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Hi ${user.fullName},</p>` +
                `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>` +
                `<p>Your password reset verification code is: <strong>${verificationCode}</strong></p>` +
                `<p>This code will expire in 1 hour. If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
        };

        // Attempt to send the email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Verification code sent successfully' });

    } catch (error) {
        console.error('Error during forgot password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default forgotPassword;
