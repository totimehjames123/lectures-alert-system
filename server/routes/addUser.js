// Import necessary modules
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import usersCollection from '../models/users.js'; // Adjust path as per your project structure

// Helper function to hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10); // 10 is the saltRounds
};

// Helper function to generate a random password
const generatePassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Helper function to send email with credentials
const sendEmail = async (email, fullName, indexNumber, password) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USERNAME,
    to: email,
    subject: 'Your Account Details',
    text: `Hello ${fullName},\n\nYour account has been created. Here are your credentials:\n\nIndex Number: ${indexNumber}\nPassword: ${password}\n\nPlease log in and change your password.\n\nBest Regards,\nAccra Technical University.`,
  };

  await transporter.sendMail(mailOptions);
};

// addUser route
export const addUser = async (req, res) => {
  const { fullName, indexNumber, email, contact, classValue, role } = req.body;

  try {
    // Check if index number or email already exists
    const existingIndexNumber = await usersCollection.findOne({ indexNumber });
    if (existingIndexNumber) {
      return res.status(400).json({ message: 'User already exists with the provided index number' });
    }

    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'User already exists with the provided email' });
    }

    const existingContact = await usersCollection.findOne({ contact });
    if (existingContact) {
      return res.status(400).json({ message: 'User already exists with the provided contact number' });
    }

    // Generate and hash password
    const password = generatePassword();
    const hashedPassword = await hashPassword(password);

    // Create new user object
    const newUser = {
      fullName,
      indexNumber,
      email,
      contact,
      classValue: role === 'Student' ? classValue : null, // Class is applicable only if the user is a Student
      role,
      password: hashedPassword,
    };

    // Save user to the database
    await usersCollection.create(newUser);

    // Send email with credentials
    await sendEmail(email, fullName, indexNumber, password);

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error during addUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default addUser;
