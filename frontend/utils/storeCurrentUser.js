import AsyncStorage from '@react-native-async-storage/async-storage';

const storeCurrentUser = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('currentUser', jsonValue);
  } catch (e) {
    console.log("Error storing user data:", e);
  }
};

export default storeCurrentUser;
