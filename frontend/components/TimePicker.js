import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const TimePicker = ({ label, time, setTime, icon = 'time-outline', moreClass = '' }) => {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (event, selectedTime) => {
    hideTimePicker();
    if (selectedTime !== undefined) {
      setTime(selectedTime);
    }
  };

  return (
    <View className={`px-3 py-[2px] flex-row items-center bg-white border rounded-md border-gray-300 ${moreClass}`}>
      {icon && (
        <Ionicons name={icon} size={20} color="gray" className="mr-2" />
      )}
      <TouchableOpacity onPress={showTimePicker} className="flex-1 p-3 bg-white border-none rounded-md">
        <Text className="text-gray-400" style={{ fontFamily: 'Poppins-Regular' }}>
          {time ? time.toLocaleTimeString() : `Select ${label}`}
        </Text>
      </TouchableOpacity>
      {isTimePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime || new Date()}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleConfirm}
          onCancel={hideTimePicker}
        />
      )}
    </View>
  );
};

export default TimePicker;
