import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommentField = ({
  moreClass = '',
  label = 'Additional Information',
  icon = 'chatbox-outline',
  onChangeText,
  value = '',
  disabled,
  numberOfLines = 4, // Default to 4 lines
}) => {
  return (
    <View className={`px-3 py-2 bg-white border rounded-md border-gray-300 ${moreClass}`}>
    <View className="flex-row gap-x-2">
      {icon && (
        <Ionicons name={icon} size={20} color="gray" className="mr-2" />
      )}
      {label && (
        <Text className="text-gray-400 mb-1" style={{ fontFamily: 'Poppins-Regular' }}>
          {label}
        </Text>
      )}
    </View>
      <TextInput
        className={` bg-white border-none rounded-md pl-${icon ? '10' : '2'}`}
        placeholder={''}
        onChangeText={onChangeText}
        value={value}
        editable={!disabled}
        multiline={true}            // Enable multiline input
        numberOfLines={numberOfLines}  // Control the height of the multiline input
        style={{ 
          fontFamily: 'Poppins-Regular', 
          textAlignVertical: 'top',     // Ensure text starts from the top in multiline mode
        }}
      />
    </View>
  );
};

export default CommentField;
