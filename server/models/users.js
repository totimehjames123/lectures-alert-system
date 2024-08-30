import mongoose from 'mongoose';

// Define schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    indexNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    contact: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid phone number (10 digits)"],
    },
    classValue: {
        type: String,
        required: function () {
            return this.role === 'Student'; // Required only for students
        },
    },
    role: {
        type: String,
        required: true,
        enum: ['Student', 'Lecturer', 'Admin'],
        default: 'Student'
    },
    password: {
        type: String,
        required: true
    },
    expoPushToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

// Create a model based on schema
const usersCollection = mongoose.model('Users', userSchema);

export default usersCollection;
