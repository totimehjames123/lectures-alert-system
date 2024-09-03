import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login";
import OnboardingScreen from "../pages/OnboardingScreen";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import ManageUsers from "../pages/ManageUsers";
import LoadingScreen from "./LoadingScreen";
import SuccessPage from "../pages/SuccessPage";
import UpdatePassword from "../pages/UpdatePassword";
import ScheduleLecture from "../pages/ScheduleLecture";
import AllLecturers from "../pages/AllLecturers";
import LecturesCalendar from "../pages/LecturesCalendar";
import LectureDetails from "../pages/LectureDetails";
import RescheduleLecture from "../pages/RescheduleLecture";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import NotificationsStackNavigator from "../navigation/NotificationsStackNavigator";
import AllLectures from "../pages/AllLectures";

const Stack = createStackNavigator();

function MyStacks() {

  return (
    <>
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontFamily: 'Poppins-Regular' } }} >
     
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerTitleAlign: 'center', headerTitle: '' }}
      />
      

      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerTitleAlign: 'center', headerTitle: '' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ headerTitleAlign: 'center', headerTitle: '' }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePassword}
        options={{ headerTitleAlign: 'center', headerTitle: '' }}
      />
      <Stack.Screen
        name="SuccessPage"
        component={SuccessPage}
        options={{ headerTitleAlign: 'center', headerTitle: '' }}
      />
      <Stack.Screen
        name="ManageUsers"
        component={ManageUsers}
        options={{ headerTitle: 'Manage Users', headerTitleAlign: 'center', headerRight: () =>
          <TouchableOpacity onPress={() => Alert.alert("Delete All", "Are you sure you want to delete all users? \nNote that this action cannot be undone!")}>
            <Ionicons name='ellipsis-vertical' size={20} style={{paddingRight: 15}}/>
          </TouchableOpacity> }}
      />
      <Stack.Screen
        name="NotificationsStack"
        component={NotificationsStackNavigator}
      />
      <Stack.Screen
        name="ScheduleLecture"
        component={ScheduleLecture}
        options={{ headerTitle: 'Schedule a Lecture' }}
      />
      <Stack.Screen
        name="AllLecturers"
        component={AllLecturers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllLectures"
        component={AllLectures}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LectureDetails"
        component={LectureDetails}
        options={{ headerTitle: "Lecture Details",}}
      />
      <Stack.Screen
        name="RescheduleLecture"
        component={RescheduleLecture}
        options={{ headerTitle: "Reschedule Lecture",}}
      />
      
      <Stack.Screen
        name="LecturesCalendar"
        component={LecturesCalendar}
        options={{headerTitle: 'Lecture Calendar' }}
      />

    </Stack.Navigator>
    </>
  );
}

export default MyStacks;
