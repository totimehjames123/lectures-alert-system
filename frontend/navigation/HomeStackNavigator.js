// HomeStackNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import ScheduleLecture from '../pages/ScheduleLecture';
import Notifications from '../pages/Notifications';
import AddUser from '../pages/AddUser';
import ManageUsers from '../pages/ManageUsers';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {fontFamily: 'Poppins-Regular'}
      }}
    >
      <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <Stack.Screen name="ScheduleLecture" component={ScheduleLecture}  options={{headerTitle: ''}} />
      <Stack.Screen name="Notifications" component={Notifications}  options={{headerTitle: ''}} />
      <Stack.Screen name="AddUser" component={AddUser}  options={{headerTitle: ''}} />
      <Stack.Screen name="ManageUsers" component={ManageUsers}  options={{headerTitleAlign: 'center', headerTitle: 'Managing Users'}} />
    </Stack.Navigator>
  );
}
