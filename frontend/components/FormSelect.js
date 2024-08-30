import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Chip, Button } from 'react-native-paper';

const FormSelect = ({ label, options, selectedValue, onSelect }) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 mb-2" style={{fontFamily: 'Poppins-Regular'}}>{label}</Text>
      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <Chip
            key={option.value}
            mode="outlined"
            selected={selectedValue === option.value}
            onPress={() => onSelect(option.value)}
            className={`mr-2 mb-2 text-gray-500 ${selectedValue === option.value ? 'bg-yellow-100' : 'bg-white'}`}
            selectedColor="gray"
            textStyle={{ color: selectedValue === option.value ? 'gray' : 'gray', fontFamily: 'Poppins-Regular' }}
          >
            {option.label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default FormSelect;
