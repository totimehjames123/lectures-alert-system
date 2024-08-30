import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Profile from '../pages/Profile';
import UpdatePassword from '../pages/UpdatePassword';
import AlertMessage from '../components/AlertMessage';

const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Remove user data from AsyncStorage
              await AsyncStorage.removeItem('currentUser'); // Adjust the key to your needs

              // Show success message
              setAlertMessage('Successfully logged out');
              setAlertType('success');
              setAlertVisible(true);

              // Wait for 2 seconds before navigating
              setTimeout(() => {
                navigation.navigate('Login');
              }, 2000);
            } catch (error) {
              console.error('Failed to log out', error);
              setAlertMessage('Failed to log out');
              setAlertType('error');
              setAlertVisible(true);
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleStyle: { fontFamily: 'Poppins-Regular' },
        }}
      >
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: 'My Profile',
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10, paddingHorizontal: 10 }}
                onPress={handleLogout}
              >
                <Ionicons name='log-out-outline' size={24} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{ headerTitle: '' }} />
      </Stack.Navigator>

      {/* Custom Alert Message Component */}
      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </>
  );
}
