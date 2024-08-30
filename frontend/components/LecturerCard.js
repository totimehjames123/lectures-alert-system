import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const LecturerCard = ({ imageSource, userName, userRole, userClass, indexNumber, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="bg-gray-100 p-2 rounded-lg mb-1 max-w-full overflow-hidden flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            className="w-12 h-12 rounded-full"
            source={imageSource || require('./../assets/profile-picture.png')} // Default image if none provided
          />
          <View className="ml-2 flex-1 max-w-[65%]">
            <Text className="text-gray-800 text-sm font-normal" numberOfLines={1} style={{ fontFamily: 'Poppins-Regular' }}>
              {userName || 'User Name'}
            </Text>
            <Text className="text-gray-500 text-xs" numberOfLines={1} style={{ fontFamily: 'Poppins-Regular' }}>
              {userRole || 'User Role'}・{indexNumber} {userRole === "Student" && `・${userClass}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LecturerCard;
