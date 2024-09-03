import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice'; // Import the selector

// This function checks if the user is logged in and valid
export default function checkIsLoggedIn() {
  const user = useSelector(selectUser); // Get the user from Redux store

  const checkUserStatus = useCallback(async () => {
    if (user && user._id && user.indexNumber) {
      const { _id, indexNumber } = user;

      try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/verify-user`, { _id, indexNumber });

        if (response.status === 200) {
          return true;
        } else {
          console.log(response.data.message);
          return false;
        }
      } catch (error) {
        console.error("Error verifying user: ", error);
        return false;
      }
    } else {
      console.log("User not logged in or missing credentials");
      return false;
    }
  }, [user]);

  return checkUserStatus;
}
