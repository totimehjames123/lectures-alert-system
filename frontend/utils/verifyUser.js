import axios from 'axios';
import getCurrentUser from './getCurrentUser';
import storeCurrentUser from './storeCurrentUser';
import { Platform, ToastAndroid, Alert } from 'react-native'; // Import necessary modules

export default async function verifyUser() {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser && currentUser._id && currentUser.indexNumber) {
      const { _id, indexNumber } = currentUser;

      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/verify-user`, { _id, indexNumber });

      if (response.status === 200) {
        await storeCurrentUser(response.data.user);
        return true;  // User is verified
      
      } else {
        // Show toast or alert based on the platform
        const message = response.data.message;
        if (Platform.OS === 'android') {
          // ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
          // Alert.alert("Verification Failed", message);
        }
        return false;  // User verification failed
      }
    } else {
      // Show toast or alert based on the platform
      const message = "User not logged in or missing credentials";
      if (Platform.OS === 'android') {
        // ToastAndroid.show(message, ToastAndroid.SHORT);
      } else {
        // Alert.alert("User Error", message);
      }
      return false;  // User is not logged in or credentials are incomplete
    }
  } catch (error) {
    // Show toast or alert based on the platform
    const message = `Error verifying user: ${error.message}`;
    if (Platform.OS === 'android') {
      // ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // Alert.alert("Verification Error", message);
    }
    // console.error("Error verifying user: ", error);
    // ToastAndroid.show("Network error!", ToastAndroid.SHORT);
    return false;  // An error occurred during verification
  }
}
