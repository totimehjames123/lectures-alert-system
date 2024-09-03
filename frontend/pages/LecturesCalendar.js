import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios';
import getInitials from '../utils/getInitials';
import { useSelector } from 'react-redux';

const colorList = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#6B7280', '#EC4899']; // blue-500, green-500, yellow-500, indigo-500, gray-500, pink-500

// Helper function to format time
const formatTime = (timeString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(timeString).toLocaleTimeString([], options);
};

const LecturesCalendar = () => {
  const [scheduleData, setScheduleData] = useState({});
  const { role, indexNumber, classValue } = useSelector((state) => state.user.user) || {};

  const fetchSchedules = useCallback(async () => {
    try {
      if (!role || !indexNumber) {
        console.log("No user data found");
        return;
      }

      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
        params: {
          role: role,
          classValue: role === 'Student' ? classValue : undefined,
          lecturerIndexNumber: role === 'Lecturer' ? indexNumber : undefined,
        },
      });

      const lectures = response.data; // Assuming your backend returns an array of lectures
      setScheduleData(generateEvents(lectures));
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  }, [role, indexNumber, classValue]);

  useEffect(() => {
    // Fetch schedules initially
    fetchSchedules();
    
    // Set up interval to fetch data every second
    const intervalId = setInterval(fetchSchedules, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchSchedules]);

  // Helper function to generate events for the Agenda component
  const generateEvents = (lectures) => {
    const events = {};

    lectures.forEach((lecture, index) => {
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
            index, // Pass the index to maintain order for color assignment
          });
        }
      }
    });

    return events;
  };

  const renderItem = (item, index) => {
    const color = colorList[index % colorList.length]; // Cycle through the colors in order

    return (
      <View className="bg-white p-4 py-6 mr-4 my-2 flex-row justify-between">
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
            {formatTime(item?.startTime)} - {formatTime(item.endTime)}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: 'Poppins-Regular', fontSize: 17, color: '#000' }}>
            {item?.lecturerName}
          </Text>
          <Text numberOfLines={2} style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#6B7280' }}>
            {item?.courseName}
          </Text>
          <Text numberOfLines={2} style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#9CA3AF' }}>
            {item?.venue} • {item?.classValue}
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View className="bg-cyan-500" style={{ borderRadius: 24, justifyContent: 'center', alignItems: 'center', width: 48, height: 48 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {getInitials(item?.lecturerName)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={scheduleData}
        renderItem={(item, index) => renderItem(item, index)}
      />
    </View>
  );
};

export default LecturesCalendar;
