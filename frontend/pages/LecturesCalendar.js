import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import getInitials from '../utils/getInitials';
import getCurrentUser from '../utils/getCurrentUser';

// Helper function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to format time
const formatTime = (timeString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(timeString).toLocaleTimeString([], options);
};

const LecturesCalendar = () => {
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          console.log("No user data found");
          return;
        }

        const { role, indexNumber, classValue } = currentUser;

        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
          params: {
            role: role,
            classValue: role === 'Student' ? classValue : undefined, // Only include classValue if the role is 'Student'
            lecturerIndexNumber: role === 'Lecturer' ? indexNumber : undefined, // Only include lecturerIndexNumber if the role is 'Lecturer'
          },
        });

        const lectures = response.data; // Assuming your backend returns an array of lectures
        setScheduleData(generateEvents(lectures));
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  // Helper function to generate events for the Agenda component
  const generateEvents = (lectures) => {
    const events = {};

    lectures.forEach((lecture) => {
      const { day, courseName, startTime, endTime, classValue, venue, lecturerName } = lecture;
      let date = new Date();

      for (let i = 0; i < 30; i++) { // Limit to 30 days ahead
        date.setDate(date.getDate() + 1);
        if (date.toLocaleDateString('en-US', { weekday: 'long' }) === day) {
          const dateString = date.toISOString().split('T')[0];
          if (!events[dateString]) events[dateString] = [];
          events[dateString].push({
            courseName,
            startTime,
            endTime,
            classValue,
            venue,
            lecturerName,
          });
        }
      }
    });

    return events;
  };

  const renderItem = (item) => {
    const randomColor = getRandomColor(); // Generate random color for each item
  
    return (
      <View className="bg-white p-4 py-6 mr-4 my-2 flex-row justify-between">
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#6B7280', marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formatTime(item?.startTime)} - {formatTime(item.endTime)}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: 'Poppins-Regular', fontSize: 17, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item?.lecturerName}
          </Text>
          <Text numberOfLines={2} style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item?.courseName}
          </Text>
          <Text numberOfLines={2} style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item?.venue} • {item?.classValue}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: randomColor, borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 48, height: 48 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {getInitials(item?.lecturerName)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  

  return (
    <View className="flex-1">
      <Agenda
        items={scheduleData}
        renderItem={renderItem}
        ListHeaderComponentStyle={{ fontFamily: 'Poppins-Regular' }}
        calendarStyle={{ fontFamily: 'Poppins-Regular' }}
      />
    </View>
  );
};

export default LecturesCalendar;
