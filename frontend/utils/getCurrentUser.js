import AsyncStorage from '@react-native-async-storage/async-storage';

const getCurrentUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('currentUser');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("Error fetching user data:", e);
  }
};

export default getCurrentUser;
