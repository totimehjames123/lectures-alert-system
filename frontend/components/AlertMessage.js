import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

const AlertMessage = ({ visible, onDismiss, message, type }) => {
  const backgroundColor = {
    success: '#4CAF50', // Green
    error: '#F44336', // Red
    warning: '#FFC107', // Yellow
  }[type || 'success'];

  const icon = {
    success: 'checkmark-circle-outline',
    error: 'close-circle-outline',
    warning: 'warning-outline',
  }[type || 'success'];

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={{ backgroundColor, position: 'relative', top: '2' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={24} style={{ color: 'white', marginRight: 8 }} />
        <Text style={{ color: 'white', fontFamily: 'Poppins-Regular' }}>{message}</Text>
      </View>
    </Snackbar>
  );
};

export default AlertMessage;
