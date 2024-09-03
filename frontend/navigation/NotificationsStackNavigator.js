import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Notifications from '../pages/Notifications';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import CustomNotificationModal from '../components/CustomNotificationModal'; // Adjust path as needed
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';

const Stack = createStackNavigator();

export default function NotificationsStackNavigator() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Access user role from Redux store
  const user = useSelector(selectUser);
  const userRole = user?.role; // Assuming `role` is a property of the user object

  const handleConfirm = () => {
    setLoading(true);
    // Simulate an API call or other async operation
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      // Handle confirm action here
    }, 2000);
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitleStyle: { fontFamily: 'Poppins-Regular' },
          headerRight: () => (
            userRole === 'Lecturer' && (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name='add-circle-outline' size={24} style={{ paddingRight: 15 }} />
              </TouchableOpacity>
            )
          ),
        }}
      >
        <Stack.Screen name="Notifications" component={Notifications} options={{ headerTitle: 'All Notifications' }} />
      </Stack.Navigator>

      {/* Custom Notification Modal */}
      <CustomNotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
}
