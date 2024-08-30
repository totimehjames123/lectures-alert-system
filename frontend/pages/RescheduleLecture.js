import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import FilterSelect from '../components/FilterSelect'; // Adjust import path if necessary
import CommentField from '../components/CommentField'; // Adjust import path if necessary
import FormButton from '../components/FormButton';
import DateTimePicker from '../components/DateTimePicker'; // Adjust import path if necessary
import AlertMessage from '../components/AlertMessage'; // Adjust import path if necessary

const RescheduleLecture = () => {
  const navigation = useNavigation()
  const route = useRoute();
  const {
    id,
    status,
  } = route.params || {};

  // States for form entries and UI feedback
  const [filter, setFilter] = useState('Scheduled'); // Default filter
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [reasonText, setReasonText] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Filter options
  const filterOptions = [
    { value: 'Scheduled', label: 'Schedule' },
    { value: 'Postponed', label: 'Postpone' },
    { value: 'Cancelled', label: 'Cancel' },
  ];

  // Determine button title based on the current filter value
  const getButtonTitle = () => {
    switch (filter) {
      case 'Postponed':
        return 'Postpone Lecture';
      case 'Cancelled':
        return 'Cancel Lecture';
      case 'Scheduled':
      default:
        return 'Schedule to Default';
    }
  };

  // Determine if the button should be disabled based on the filter and status
  const isButtonDisabled = () => {
    if (filter === 'Scheduled') {
      return status === 'Scheduled';
    }
    if (filter === 'Cancelled') {
      return status === 'Cancelled';
    }
    return false;
  };

  // Get text for Scheduled filter
  const getScheduledText = () => {
    if (status === 'Scheduled') {
      return "The lecture has already been scheduled to its default mode. You don't need to schedule anymore. Try other options like Postpone lectures or Cancel lectures.";
    } else {
      return `Click the button below to schedule the lecture to its default status before it was ${status.toLowerCase()}`;
    }
  };

  // Get text for Cancelled filter
  const getCancelledText = () => {
    if (status === 'Cancelled') {
      return "The lecture has already been cancelled. You don't need to cancel it again. Try other options like Postpone or Schedule (default) lectures.";
    } else {
      return `Click the button below to cancel the lecture. It was previously ${status.toLowerCase()}`;
    }
  };

  // Get appropriate text based on the current filter and status
  const getFilterText = () => {
    switch (filter) {
      case 'Scheduled':
        return getScheduledText();
      case 'Cancelled':
        return getCancelledText();
      default:
        return '';
    }
  };

  // Handle form submission
  const handleSubmit = async () => {

    if (filter === 'Postponed' && rescheduleDate < new Date()) {
        setAlertType('error');
        setAlertMessage('The reschedule date cannot be in the past.');
        setAlertVisible(true);
        return;
      }

    // Construct the data to be sent to the server
    const data = {
      status: filter,
      reason: reasonText,
      rescheduledDate: filter === 'Postponed' ? rescheduleDate.toISOString() : undefined
    };

    

    setLoading(true);

    try {
      const response = await axios.put(`${process.env.EXPO_PUBLIC_SERVER_URL}/update-lecture-status/${id}`, data);

      if (response.status === 200) {
        setAlertType('success');
        setAlertMessage('The lecture status has been updated successfully.');
        setAlertVisible(true);

        setTimeout(() => {
          setAlertVisible(false);
          // Re-verify user after clearing storage
          navigation.navigate("BottomTabNavigation")
        }, 2000); 
        
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Update failed');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Update failed');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white p-3">
      {/* Filter Selection */}
      <FilterSelect
        options={filterOptions}
        selectedValue={filter}
        onSelect={setFilter}
      />

      {/* Conditional Rendering based on filter selection */}
      {filter === 'Postponed' && (
        <>
          <Text className="text-gray-500 mb-3" style={{ fontFamily: 'Poppins-Regular' }}>
            Set a date and time for the postponement of this lecture and provide some reasons for postponement.
          </Text>
          <DateTimePicker
            label="Reschedule Date"
            date={rescheduleDate}
            setDate={setRescheduleDate}
            moreClass="mb-4"
          />
          <CommentField
            moreClass="mb-4"
            value={reasonText}
            label={"Reason for Postponing (optional)"}
            numberOfLines={undefined}
            onChangeText={setReasonText}
          />
        </>
      )}

      {filter === 'Cancelled' && (
        <>
          <CommentField
            moreClass="mb-4"
            value={reasonText}
            label="Reason for Cancelling (optional)"
            numberOfLines={undefined}
            onChangeText={setReasonText}
          />
        </>
      )}

      {filter !== 'Postponed' && (
        <Text className="text-gray-500 mb-3" style={{ fontFamily: 'Poppins-Regular' }}>
          {getFilterText()}
        </Text>
      )}

      <FormButton
        title={loading ? <ActivityIndicator color="#fff" /> : getButtonTitle()}
        onPress={handleSubmit}
        disabled={isButtonDisabled() || loading}
      />

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default RescheduleLecture;
