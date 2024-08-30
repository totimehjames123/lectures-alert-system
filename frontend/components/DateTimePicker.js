import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';

const DateTimePicker = ({ label, date, setDate, icon = 'calendar-outline', moreClass = '' }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate);
  };

  return (
    <View className={`px-3 flex-row items-center bg-white border rounded-md border-gray-300 ${moreClass}`}>
      {icon && (
        <Ionicons name={icon} size={20} color="gray" className="mr-2" />
      )}
      <TouchableOpacity onPress={showDatePicker} className="flex-1 p-3 bg-white border-none rounded-md">
        <Text className="text-gray-400" style={{ fontFamily: 'Poppins-Regular' }}>
          {date ? date.toLocaleString() : `Select ${label}`}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DateTimePicker;
