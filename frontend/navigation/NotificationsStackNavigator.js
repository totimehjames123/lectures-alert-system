
import { createStackNavigator } from '@react-navigation/stack';

import Notifications from '../pages/Notifications';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

export default function NotificationsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {fontFamily: 'Poppins-Regular'},
      }}
      
    >
      <Stack.Screen name="Notifications" component={Notifications} options={{headerTitle: 'All Notifications'}}/>
    </Stack.Navigator>
  );
}
