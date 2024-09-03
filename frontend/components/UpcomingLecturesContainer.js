import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import TextWithLink from './TextWithLink';
import UpcomingLecturesCard from './UpcomingLecturesCard';
import { useNavigation } from '@react-navigation/native';
import formatTime from '../utils/formatTime';
import { useSelector } from 'react-redux';
import { selectUser, selectUserRole } from '../redux/userSlice';

// Utility function to sort days of the week
const sortDaysOfWeek = (lectures) => {
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return lectures.sort((a, b) => {
    const dayA = daysOrder.indexOf(a.day);
    const dayB = daysOrder.indexOf(b.day);
    return dayA - dayB;
  });
};

const UpcomingLecturesContainer = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch user data from Redux store
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);

  // Extract additional fields from user
  const userIndexNumber = user?.indexNumber;
  const userClassValue = user?.classValue;

  useEffect(() => {
    let interval;

    const fetchUpcomingLectures = async () => {
      try {
        if (!userRole) {
          // console.log("No user role found");
          return;
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
          params: {
            role: userRole,
            classValue: userRole === 'Student' ? userClassValue : undefined,
            lecturerIndexNumber: userRole === 'Lecturer' ? userIndexNumber : undefined,
          },
        });

        let lectures = response.data;
        lectures = sortDaysOfWeek(lectures); // Sort lectures by day of the week
        setLectures(lectures);
      } catch (error) {
        // console.error('Error fetching upcoming lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingLectures();

    // Poll every hour
    interval = setInterval(fetchUpcomingLectures, 1000); // 1 hour in milliseconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [userRole, userIndexNumber, userClassValue]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FBBF24" />;
  }

  return (
    <>
      <TextWithLink moreClass={'my-3'} title={'Upcoming Lectures'} buttonTitle={'View all'} onPress={() => navigation.navigate("AllLectures")} />
      <View>
        {lectures.map((lecture, index) => (
          <UpcomingLecturesCard
            key={index}
            imageSource={require('./../assets/profile-picture.png')}
            id={lecture._id}
            lecturerName={lecture.lecturerName}
            lecturerIndexNumber={lecture?.lecturerIndexNumber || "no id"}
            courseTitle={lecture.courseName}
            rescheduledDate={lecture.rescheduledDate}
            time={formatTime(lecture.startTime, lecture.endTime, lecture.day)}
            startTime={lecture.startTime}
            endTime={lecture.endTime}
            day={lecture.day}
            venue={lecture.venue}
            status={lecture.status}
            classValue={lecture.classValue}
            comment={lecture.comment}
            reason={lecture.reason}
            createdAt={lecture.createdAt}
          />
        ))}
      </View>
    </>
  );
};

export default UpcomingLecturesContainer;
