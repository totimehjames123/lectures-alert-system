import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getIconAndColor = (action) => {
  switch (action) {
    case 'Scheduled':
      return { icon: 'calendar-outline', color: '#10B981' }; // Green
    case 'Postponed':
      return { icon: 'time-outline', color: '#F59E0B' }; // Orange
    case 'Cancelled':
      return { icon: 'close-circle-outline', color: '#F87171' }; // Red
    case 'Deleted':
      return { icon: 'trash-outline', color: '#6B7280' }; // Gray
    default:
      return { icon: 'notifications-outline', color: '#6B7280' }; // Default gray
  }
};

const NotificationsCard = ({ action , title, description, period, isRead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { icon, color } = getIconAndColor(action);

  const toggleExpanded = () => {
    // Trigger the animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity
      className={`${isRead ? 'bg-white' : 'bg-gray-200'} p-2 max-w-full overflow-hidden`}
      onPress={toggleExpanded}
    >
      <View className="flex-row items-start justify-between">
        <View className={`flex-row items-${isExpanded ? 'start' : 'center'} flex-1`}>
          <View className="w-12 h-12 justify-center items-center rounded-full" style={{ backgroundColor: color }}>
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <View className="ml-2 flex-1">
            <Text
              className="text-gray-800 text-sm font-normal"
              numberOfLines={isExpanded ? undefined : 1}
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {title == "Other" ? "Customized" : title}
            </Text>
            <Text
              className="text-gray-500 text-xs"
              numberOfLines={isExpanded ? undefined : 2}
              style={{ fontFamily: 'Poppins-Regular' }}
            >
              {description}
            </Text>
            {description.length > 60 && (
              <Text
                className="text-yellow-500 text-xs"
                onPress={toggleExpanded}
                style={{ fontFamily: 'Poppins-Regular' }}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </Text>
            )}
          </View>
        </View>
        <View className="flex-shrink-0 max-w-[30%]">
          <Text
            className="text-gray-400 text-[9px] text-right"
            style={{ fontFamily: 'Poppins-Regular' }}
            numberOfLines={2}
          >
            {period}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationsCard;
