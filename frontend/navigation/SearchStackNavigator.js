// HomeStackNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Feed from '../pages/Feed';
import ScheduleLecture from '../pages/ScheduleLecture';
import Notifications from '../pages/Notifications';
import AddUser from '../pages/AddUser';
import AllLectures from '../pages/AllLectures';
import LectureDetails from '../pages/LectureDetails';

const Stack = createStackNavigator();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {fontFamily: 'Poppins-Regular'}
      }}
    >
      <Stack.Screen name="AllLectures" component={AllLectures} options={{headerShown: false}}/>
      <Stack.Screen name="LectureDetails" component={LectureDetails}  options={{headerTitle: 'Lecture Details'}} />
      
    </Stack.Navigator>
  );
}
