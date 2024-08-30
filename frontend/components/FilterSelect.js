import React from 'react';
import { View } from 'react-native';
import { Chip } from 'react-native-paper';

const FilterSelect = ({ options, selectedValue, onSelect }) => {
  return (
    <View className="mb-4">
      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <Chip
            key={option.value}
            mode="outlined"
            style={{
              borderWidth: 1,
              borderColor: selectedValue === option.value ? '#8A2BE2B3' : '#D1D5DB', // violet for selected, gray-400 for unselected
              backgroundColor: selectedValue === option.value ? '#E0E7FF' : '#F3F4F6', // light violet for selected, gray-100 for unselected
            }}
            selected={selectedValue === option.value}
            onPress={() => onSelect(option.value)}
            className={`mr-2 mb-2 rounded-3xl text-gray-500 ${selectedValue === option.value ? 'bg-violet-200' : 'bg-gray-100'}`}
            selectedColor="#8A2BE2"
            
            textStyle={{ color: selectedValue === option.value ? '#8A2BE2' : 'gray', fontFamily: 'Poppins-Regular' }}
          >
            {option.label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default FilterSelect;
