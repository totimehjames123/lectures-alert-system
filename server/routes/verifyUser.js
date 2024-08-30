import usersCollection from "../models/users.js";

export const verifyUser = async (req, res) => {
    const { _id, indexNumber } = req.body;

    try {
        const userFound = await usersCollection.findOne({ _id, indexNumber });

        if (!userFound) {
            return res.status(401).json({ message: 'Invalid user credentials' });
        }

        return res.status(200).json({ message: 'User verified successfully!', user: userFound });

    } catch (error) {
        console.error('Error during verifying user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default verifyUser;
