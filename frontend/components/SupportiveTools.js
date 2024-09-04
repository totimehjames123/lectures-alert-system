// src/components/SupportiveTools.js

import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux'; // Import useSelector directly
import { selectUserRole } from '../redux/userSlice'; // Import the selector
import TextWithLink from './TextWithLink';
import { useNavigation } from '@react-navigation/native';

const SUPPORTIVE_TOOLS_DATA = [
  { id: '1', icon: 'person-add-outline', title: 'Add user', iconColor: '#F87171', link: 'AddUser' },
  { id: '2', icon: 'calendar-outline', title: 'Schedule', iconColor: '#F59E0B', link: 'LecturesCalendar' },
  { id: '3', icon: 'people-outline', title: 'Manage users', iconColor: '#10B981', link: 'ManageUsers' },
  { id: '4', icon: 'notifications-outline', title: 'Notifications', iconColor: '#A78BFA', link: 'NotificationsStack' },
];

const SupportiveTools = () => {
  const [filteredTools, setFilteredTools] = useState([]);
  const userRole = useSelector(selectUserRole); // Use useSelector directly
  const navigation = useNavigation();

  useEffect(() => {
    let toolsToShow = [];

    if (userRole === 'Admin') {
      toolsToShow = SUPPORTIVE_TOOLS_DATA;
    } else if (userRole === 'Lecturer' || userRole === 'Student') {
      toolsToShow = SUPPORTIVE_TOOLS_DATA.filter(
        (tool) => tool.link === 'LecturesCalendar' || tool.link === 'NotificationsStack'
      );
    }

    setFilteredTools(toolsToShow);
  }, [userRole]); // Re-run effect when userRole changes

  // If no tools should be displayed, render nothing
  if (filteredTools.length === 0) {
    return null;
  }

  return (
    <>
      <TextWithLink 
        moreClass={'my-3'} 
        title={'Supportive tools'} 
        buttonTitle={'Explore'} 
        onPress={() => navigation.navigate("LecturesCalendar")}
      />
      <FlatList
        data={filteredTools}
        renderItem={({ item }) => (
          <SupportiveToolsCard
            icon={item.icon}
            title={item.title}
            iconColor={item.iconColor}
            link={item.link}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 10 }}
        className="border border-gray-100 rounded-md"
      />
    </>
  );
};

const SupportiveToolsCard = ({ icon, title, iconColor, link, navigation }) => {
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate(link)}
      className="flex-1 m-1 bg-gray-100 justify-center items-center w-[48%] p-3 rounded-lg"
    >
      <Ionicons name={icon} size={30} color={iconColor} />
      <Text className="text-gray-500 text-center mt-2" style={{ fontFamily: 'Poppins-Regular' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SupportiveTools;
