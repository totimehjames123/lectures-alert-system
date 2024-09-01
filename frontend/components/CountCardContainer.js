import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import CountCards from './CountCards';
import getCurrentUser from '../utils/getCurrentUser';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CountCardContainer = () => {
  const [role, setRole] = useState(null);
  const [classValue, setClassValue] = useState(null);
  const [indexNumber, setIndexNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState([]);

  const navigation = useNavigation()

  // Fetch all students
  const getStudents = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
      const allUsers = response?.data?.users;
      // Filter only students
      const students = allUsers?.filter(user => user.role === 'Student');
      return students.length; // Return the count of students
    } catch (error) {
      console.error('Error fetching students:', error);
      return 0; // Return 0 if there's an error
    }
  };

  // Fetch all lecturers
  const getLecturers = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
      const allUsers = response?.data?.users;
      // Filter only lecturers
      const lecturers = allUsers?.filter(user => user.role === 'Lecturer');
      return lecturers.length; // Return the count of lecturers
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      return 0; // Return 0 if there's an error
    }
  };

  const fetchUserDataAndScheduleData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return;
      }

      const { role, indexNumber, classValue } = user;
      setRole(role);
      setIndexNumber(indexNumber);
      setClassValue(classValue);

      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
        params: {
          role: role,
          classValue: role === 'Student' ? classValue : undefined,
          lecturerIndexNumber: role === 'Lecturer' ? indexNumber : undefined,
        },
      });

      const schedules = response.data;

      const scheduledLecturesCount = schedules.filter(schedule => schedule.status === 'Scheduled').length;
      const postponedLecturesCount = schedules.filter(schedule => schedule.status === 'Postponed').length;
      const cancelledLecturesCount = schedules.filter(schedule => schedule.status === 'Cancelled').length;
      const studentCount = await getStudents(); // Fetch student count
      const lecturerCount = await getLecturers(); // Fetch lecturer count

      const allCards = [
        {
          id: '1',
          title: 'Scheduled Lectures',
          value: scheduledLecturesCount,
          bgColor: 'bg-orange-200',
          textColor: 'text-yellow-500',
          iconColor: '#FBBF24',
          iconName: 'calendar-outline',
          link: 'SearchStack'
        },
        {
          id: '2',
          title: 'Total Students',
          value: studentCount, // Use dynamic student count
          bgColor: 'bg-violet-200',
          textColor: 'text-violet-400',
          iconColor: '#A78BFA',
          iconName: 'people-outline',
          link: 'ManageUsers'
        },
        {
          id: '3',
          title: 'Total Lecturers',
          value: lecturerCount, // Use dynamic lecturer count
          bgColor: 'bg-gray-200',
          textColor: 'text-gray-500',
          iconColor: '#6B7280',
          iconName: 'school-outline',
          link: 'ManageUsers'
        },
        {
          id: '4',
          title: 'Postponed Lectures',
          value: postponedLecturesCount,
          bgColor: 'bg-blue-200',
          textColor: 'text-blue-500',
          iconColor: '#3B82F6',
          iconName: 'time-outline',
          link: 'SearchStack'
        },
        {
          id: '5',
          title: 'Cancelled Lectures',
          value: cancelledLecturesCount,
          bgColor: 'bg-red-200',
          textColor: 'text-red-500',
          iconColor: '#EF4444',
          iconName: 'close-circle-outline',
          link: 'SearchStack'
        },
      ];

      let filteredCards = [];

      if (role === 'Admin') {
        filteredCards = allCards;
      } else if (role === 'Student' || role === 'Lecturer') {
        filteredCards = allCards.filter(card =>
          card.title === 'Scheduled Lectures' ||
          card.title === 'Postponed Lectures' ||
          card.title === 'Cancelled Lectures'
        );
      }

      setCardData(filteredCards);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDataAndScheduleData();
    const interval = setInterval(fetchUserDataAndScheduleData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
    >
      {cardData.map((card) => (
        <CountCards
          key={card.id}
          title={card.title}
          value={card.value}
          bgColor={card.bgColor}
          textColor={card.textColor}
          iconColor={card.iconColor}
          iconName={card.iconName}
          onPress={() => navigation.navigate(card.link)}
        />
      ))}
    </ScrollView>
  );
};

export default CountCardContainer;
