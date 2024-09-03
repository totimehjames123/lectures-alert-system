import React, { useCallback } from 'react';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice'; // Import the selector

const CheckLoginAndNavigate = ({ passedPath, failedPath }) => {
  const navigation = useNavigation();
  const user = useSelector(selectUser); // Get user from Redux store

  useFocusEffect(
    useCallback(() => {
      const checkUserStatus = async () => {
        if (user && user._id && user.indexNumber) {
          const { _id, indexNumber } = user;

          try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/verify-user`, { _id, indexNumber });

            if (response.status === 200) {
              // User is verified, navigate to the passed path
              navigation.navigate(passedPath);
            } else {
              console.log(response.data.message);
              navigation.navigate(failedPath);
            }
          } catch (error) {
            console.error("Error verifying user: ", error);
            navigation.navigate(failedPath);
          }
        } else {
          console.log("User not logged in or missing credentials");
          navigation.navigate(failedPath);
        }
      };

      checkUserStatus();
    }, [navigation, passedPath, failedPath, user]) // Include `user` as a dependency
  );

  return null; // This component doesn't render anything
};

export default CheckLoginAndNavigate;
