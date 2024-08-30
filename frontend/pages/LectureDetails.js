import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import FormInput from '../components/FormInput';
import CommentField from '../components/CommentField';
import FormButton from '../components/FormButton';
import checkUserRole from '../utils/checkUserRole';
import AlertMessage from '../components/AlertMessage';

const LectureDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    id,
    lecturerName,
    lecturerIndexNumber,
    courseTitle,
    rescheduledDate,
    startTime,
    endTime,
    classValue,
    day,
    venue,
    status,
    reason,
    comment
  } = route.params || {};

  const [userRole, setUserRole] = useState('student');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await checkUserRole();
      setUserRole(role);
    };

    fetchUserRole();
  }, []);

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(date).toLocaleString('en-US', options);
  };

  const isEditable = userRole === 'admin';

  const handleReschedulePress = () => {
    navigation.navigate('RescheduleLecture', {
      id,
      lecturerName,
      lecturerIndexNumber,
      courseTitle,
      rescheduledDate,
      startTime,
      endTime,
      day,
      classValue,
      venue,
      status,
      reason,
      comment
    });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this lecture?',
      [
        { text: 'No', onPress: () => console.log('Delete cancelled'), style: 'cancel' },
        { text: 'Yes', onPress: async () => {
          setLoading(true);
          try {
            const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URL}/delete-schedule/${id}`);
            setAlertType('success');
            setAlertMessage(response.data.message || 'Lecture deleted successfully');
            setAlertVisible(true);
            setTimeout(() => {
              navigation.goBack();
            }, 2000); // Wait for 2 seconds before going back
          } catch (error) {
            setAlertType('error');
            setAlertMessage(error.response?.data?.message || 'Failed to delete the lecture');
            setAlertVisible(true);
          } finally {
            setLoading(false);
          }
        } }
      ]
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FormInput
            icon="person-outline"
            moreClass="mb-2"
            value={lecturerName}
            label="Lecture's Name"
            disabled={true}
          />
          <FormInput
            icon="id-card-outline"
            moreClass="mb-2"
            value={lecturerIndexNumber}
            label="Lecturer's ID"
            disabled={true}
          />
          <FormInput
            icon="book-outline"
            moreClass="mb-2"
            value={courseTitle}
            label="Course Title"
            disabled={true}
          />
          <FormInput
            icon="grid-outline"
            moreClass="mb-2"
            value={classValue}
            label="Class"
            disabled={true}
          />
          <FormInput
            icon="calendar-outline"
            moreClass="mb-2"
            value={day}
            label="Day"
            disabled={true}
          />
          <FormInput
            icon="location-outline"
            moreClass="mb-2"
            value={venue}
            label="Venue"
            disabled={true}
          />
          <FormInput
            icon="time-outline"
            moreClass="mb-2"
            value={"Starts From " + formatTime(startTime)}
            label="Start Time"
            disabled={true}
          />
          <FormInput
            icon="time-outline"
            moreClass="mb-2"
            value={"Ends at " + formatTime(endTime)}
            label="End Time"
            disabled={true}
          />
          {status === "Postponed" ?
            <CommentField
              moreClass="mb-4"
              value={"Lectures " + status + " to " + formatDate(rescheduledDate)}
              label="Status"
              numberOfLines={undefined}
              disabled={true}
            />
            :
            <FormInput
              icon="alert-circle-outline"
              moreClass="mb-2"
              value={status}
              label="Status"
              disabled={false}
            />
          }
          {status !== "Scheduled" && (
            <CommentField
              moreClass="mb-4"
              value={reason || "No reason stated"}
              label="Reason"
              numberOfLines={undefined}
              disabled={true}
            />
          )}
          <CommentField
            moreClass="mb-4"
            value={comment}
            label="Additional Information"
            numberOfLines={undefined}
            disabled={true}
          />
          {userRole === "lecturer" && 
            <FormButton title={'Reschedule Lecture'} onPress={handleReschedulePress} /> 
          }
          {userRole === "admin" && 
            <FormButton
              title={loading ? <ActivityIndicator color="#fff" /> : 'Delete This Lecture'}
              onPress={handleDeletePress}
              disabled={loading}
            /> 
          }
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

export default LectureDetails;
