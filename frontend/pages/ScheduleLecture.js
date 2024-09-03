import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import TimePicker from '../components/TimePicker';
import CommentField from '../components/CommentField';
import AlertMessage from '../components/AlertMessage';
import { classes, days } from '../utils/constants';
import { useRoute } from '@react-navigation/native';
import SearchablePicker from '../components/SearchablePicker';

const ScheduleLecture = ({ navigation }) => {

  const route = useRoute();
  const { fullName, indexNumber } = route.params || {};

  const [courseName, setCourseName] = useState('');
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [classValue, setClassValue] = useState('CPS 2B');
  const [venue, setVenue] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');


  const validateInputs = () => {
    if (!courseName.trim()) return 'Course Name is required';
    if (!day.trim()) return 'Day is required';
    if (!startTime) return 'Start Time is required';
    if (!endTime) return 'End Time is required';
    if (!venue.trim()) return 'Venue is required';
    if (startTime >= endTime) return 'Start Time must be before End Time';
    return null;
  };

  const handleScheduleLecture = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/schedule-lecture`, {
        lecturerName: fullName,
        lecturerIndexNumber: indexNumber,
        courseName,
        day,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        classValue,
        venue,
        comment,
      });

      if (response.status === 201) {
        setCourseName('');
        setDay('');
        setStartTime(null);
        setEndTime(null);
        setClassValue('CPS 2B');
        setVenue('');
        setComment('');
        setAlertType('success');
        setAlertMessage(response.data.message || "Lecture scheduled successfully");
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
          // Re-verify user after clearing storage
          navigation.goBack()
        }, 2000); 
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Failed to schedule lecture');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Failed to schedule lecture');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FormInput
            icon="person-outline"
            moreClass="mb-2"
            value={ fullName}
            label="Lecture's Name"
            disabled={true}
          />
          <FormInput
            icon="id-card-outline"
            moreClass="mb-2"
            value={ indexNumber}
            label="Lecturer's ID"
            disabled={true}
          />

          <FormInput
            icon="book-outline"
            moreClass="mb-2"
            onChangeText={setCourseName}
            value={courseName}
            label="Course Name"
          />
          {/* <FormInput
            icon="calendar-outline"
            moreClass="mb-2"
            onChangeText={setDay}
            value={day}
            label="Day"
          /> */}
          <FormInput
            icon="location-outline"
            moreClass="mb-2"
            onChangeText={setVenue}
            value={venue}
            label="Venue"
          />
          <SearchablePicker
            icon="calendar-outline"
            label="Day"
            options={days}
            selectedValue={setDay}
            onSelect={setDay}
            moreClass={'mb-2'}
          />
          <SearchablePicker
            icon="grid-outline"
            label="Class"
            options={classes}
            selectedValue={classValue}
            onSelect={setClassValue}
            moreClass={'mb-2'}
          />
          <TimePicker
            label="Start Time"
            time={startTime}
            setTime={setStartTime}
            moreClass='mb-2'
          />
          <TimePicker
            label="End Time"
            time={endTime}
            setTime={setEndTime}
            moreClass='mb-2'
          />
          
          
          
          <CommentField 
            moreClass="mb-4"
            onChangeText={setComment}
            value={comment}
            label="Additional Information (Optional)"
            numberOfLines={undefined}
          />
          <FormButton
            title={!loading ? 'Schedule' : <ActivityIndicator color="#fff" />}
            onPress={handleScheduleLecture}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default ScheduleLecture;
