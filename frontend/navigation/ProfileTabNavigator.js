import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Profile from '../pages/Profile';
import UpdatePassword from '../pages/UpdatePassword';
import AlertMessage from '../components/AlertMessage';
import { clearUser } from '../redux/userSlice';
import { selectUser } from '../redux/userSlice';

const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  // Get the selected user from Redux state
  const selectedUser = useSelector(selectUser);

  // Extract the first name from the full name
  const userName = selectedUser?.fullName?.split(' ')[0] || 'User';

  const handleLogout = () => {
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
          onPress: () => {
            try {
              // Dispatch the action to clear user data
              dispatch(clearUser());

              // Show success message
              setAlertMessage('Successfully logged out');
              setAlertType('success');
              setAlertVisible(true);

              // Reset the navigation stack
              setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
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
            headerTitle: `${userName}'s Profile`,
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

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </>
  );
}
