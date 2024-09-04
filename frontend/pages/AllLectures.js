import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import FilterSelect from '../components/FilterSelect';
import SearchInput from '../components/SearchInput';
import UpcomingLecturesCard from '../components/UpcomingLecturesCard';
import AlertMessage from '../components/AlertMessage';
import formatTime from '../utils/formatTime';
import { selectUser } from '../redux/userSlice';
import Header from '../components/Header';
import { useSelector } from 'react-redux';

const AllLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // Default to 'All'
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const user = useSelector(selectUser); // Get user data from Redux store

  // Guard against user being null or undefined
  const role = user?.role;
  const indexNumber = user?.indexNumber;
  const classValue = user?.classValue;

  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Postponed', value: 'Postponed' },
  ];

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        
        if (!user) {
          setAlertType('error');
          setAlertMessage('No user data found');
          setAlertVisible(true);
          return;
        }


        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-schedules`, {
          params: {
            role: role,
            classValue: role === 'Student' ? classValue : undefined,
            lecturerIndexNumber: role === 'Lecturer' ? indexNumber : undefined,
          },
        });

        setLectures(response.data);
      } catch (error) {
        setAlertType('error');
        setAlertMessage('Error fetching lectures');
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchLectures();
    }, 1000); // Refresh every 1 second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = lectures;

      if (selectedFilter !== 'All') {
        result = result.filter(lecture => lecture.status === selectedFilter);
      }

      if (searchQuery) {
        result = result.filter(lecture =>
          lecture.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lecture.lecturerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredLectures(result);
    };

    applyFilters();
  }, [lectures, searchQuery, selectedFilter]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FBBF24" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white ">
      <Header title={'All Lectures'} description={"Search and select a lecture"} />
      {/* Search Input */}
      <SearchInput
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by course or lecturer"
        moreClass={"mt-2"}
      />

      {/* Filter Dropdown */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          <FilterSelect
            options={filterOptions}
            selectedValue={selectedFilter}
            onSelect={setSelectedFilter}
          />
        </ScrollView>
      </View>

      {/* Lectures List */}
      {filteredLectures.length > 0 ? (
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
          {filteredLectures.map((lecture, index) => (
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
        </ScrollView>
      ) : (
        <Text className="text-center text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>No lectures found.</Text>
      )}

      {/* Alert Message */}
      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterScroll: {
    marginTop: 10,
  },
});

export default AllLectures;
