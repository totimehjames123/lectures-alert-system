import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

// Define colors for different statuses
const statusColors = {
  Postponed: 'orange', // Warning color
  Cancelled: 'red', // Danger color
  Scheduled: 'green', // Success color
};

// Function to get abbreviated day of the week
const getAbbreviatedDayOfWeek = (date) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = new Date(date).getDay();
  return daysOfWeek[day];
};

const UpcomingLecturesCard = ({ imageSource, id, lecturerName, lecturerIndexNumber, classValue, courseTitle, time = 'now', startTime, endTime, status, rescheduledDate, day, venue, comment, reason, createdAt }) => {
  const navigation = useNavigation()

  // Determine the color based on the status
  const statusColor = statusColors[status] || 'gray'; // Default color if status is not defined

  // Format status text based on rescheduledDate
  const formattedStatus = status === 'Postponed' && rescheduledDate
    ? `Postponed to ${getAbbreviatedDayOfWeek(rescheduledDate)}`
    : status || 'Status';
    
  // const formattedStatus = status === 'Postponed' && rescheduledDate
  //   ? `Postponed to ${getAbbreviatedDayOfWeek(rescheduledDate)}`
  //   : status || 'Status';

  return (
    <TouchableOpacity className="bg-gray-100 p-2 rounded-lg mb-1 max-w-full overflow-hidden" onPress={() => navigation.navigate(
      "LectureDetails", {
        id: id, lecturerName: lecturerName, lecturerIndexNumber: lecturerIndexNumber, courseTitle: courseTitle, time: time, startTime: startTime, endTime: endTime,
        status: status, rescheduledDate: rescheduledDate, day: day, classValue: classValue, venue: venue, comment: comment, reason: reason, createdAt: createdAt }
    )}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            className="w-12 h-12 rounded-full"
            source={imageSource || require('./../assets/profile-picture.png')} // Default image if none provided
          />
          <View className="ml-2 flex-1 max-w-[70%]">
            <Text className="text-gray-800 text-sm font-normal" numberOfLines={1} style={{ fontFamily: 'Poppins-Regular' }}>
              {lecturerName || 'Lecture Name'}
            </Text>
            <Text className="text-gray-500 text-xs" numberOfLines={2} style={{ fontFamily: 'Poppins-Regular' }}>
              {courseTitle || 'Course Title'}
            </Text>
          </View>
        </View>
        <View className="flex-shrink-0 max-w-[30%]">
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Text 
              className="text-gray-500 text-[9px] text-right" 
              style={{ fontFamily: 'Poppins-Regular', lineHeight: 10 }} // Adjust lineHeight to bring day and time closer
              numberOfLines={2}
            >
              {day}
            </Text>
            <Text 
              className="text-gray-400 text-[6px] text-right" 
              style={{ fontFamily: 'Poppins-Regular', lineHeight: 7 }} // Adjust lineHeight to bring day and time closer
              numberOfLines={2}
            >
              {time}
            </Text>
          </View>
          <Text 
            className="text-[9px] text-right" 
            style={{ fontFamily: 'Poppins-Regular', color: statusColor, marginTop: 'auto' }} // Ensure it is positioned at the bottom
            numberOfLines={2}
          >
            {status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UpcomingLecturesCard;
