import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import TextWithLink from './TextWithLink';
import UpcomingLecturesCard from './UpcomingLecturesCard';
import { useNavigation } from '@react-navigation/native';
import getCurrentUser from '../utils/getCurrentUser';
import formatTime from '../utils/formatTime';

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

  useEffect(() => {
    let interval;

    const fetchUpcomingLectures = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // console.log("No user data found");
          return;
        }

        const { role, indexNumber, classValue } = currentUser;

        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
          params: {
            role: role,
            classValue: role === 'Student' ? classValue : undefined,
            lecturerIndexNumber: role === 'Lecturer' ? indexNumber : undefined,
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
    interval = setInterval(fetchUpcomingLectures, 3600000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
