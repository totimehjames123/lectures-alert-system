import React, { useEffect } from 'react';
import { View, ActivityIndicator, ToastAndroid, Platform, Animated, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoadingScreen({ text1 = "Loading", text2 = ":Please wait ..." }) {
  useEffect(() => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${text1} ${ text2}`, ToastAndroid.SHORT);
    } else {
      showCustomToast();
    }
  }, [text1, text2]);

  const showCustomToast = () => {
    Toast.show({
      type: 'info',
      text1: text1,
      text2: text2,
      visibilityTime: 2000, 
      text1Style: { fontFamily: 'Poppins-Regular' }
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color="#F59E0B" />
    </View>
  );
}

