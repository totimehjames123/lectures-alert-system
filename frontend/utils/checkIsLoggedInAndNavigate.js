import { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import getCurrentUser from './getCurrentUser';
import storeCurrentUser from './storeCurrentUser';

export default function checkIsLoggedInAndNavigate(passedPath, failedPath) {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const checkUserStatus = async () => {
        const currentUser = await getCurrentUser();

        if (currentUser && currentUser._id && currentUser.indexNumber) {
          const { _id, indexNumber } = currentUser;

          try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/verify-user`, { _id, indexNumber });

            if (response.status === 200) {
              // await storeCurrentUser(response.data.user);
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
    }, [navigation, passedPath, failedPath])
  );

  return null;  // This is a utility function, so it returns nothing to render
}
