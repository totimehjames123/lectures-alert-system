import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useSelector } from 'react-redux'; // Import useSelector
import { selectUserRole } from '../redux/userSlice'; // Import the selector
import HomeStackNavigator from './HomeStackNavigator';
import NotificationsStackNavigator from './NotificationsStackNavigator';
import AllLecturers from '../pages/AllLecturers';
import ProfileStackNavigator from './ProfileTabNavigator';
import SearchStackNavigator from './SearchStackNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const role = useSelector(selectUserRole); // Get the role from the Redux store

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#F9A825',
        tabBarInactiveTintColor: '#4B5563',
        tabBarStyle: { height: 60, paddingBottom: 7 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: -5, fontFamily: 'Poppins-Regular' },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchStack"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: 'Search',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      
      {role === 'Admin' && (
        <Tab.Screen
          name="AddLecturer"
          component={AllLecturers}
          options={{
            tabBarLabel: '',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View style={{
                backgroundColor: '#F9A825',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 100,
                width: 50,
                height: 50,
                elevation: 5,
                marginBottom: 15,
              }}>
                <Ionicons name="add-outline" color={'#4B5563'} size={size} />
              </View>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStackNavigator}
        options={{
          tabBarLabel: 'Notifications',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'My Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
