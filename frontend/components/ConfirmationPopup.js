// components/ConfirmationPopup.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

const ConfirmationPopup = ({ visible, onClose, onConfirm, message, title, loading }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <View className="bg-white p-5 rounded-lg w-4/5 relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-3"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg text-center mb-4" style={{fontFamily: "Poppins-Regular"}}>{title}</Text>
          <Text className="text-sm text-gray-600 text-center mb-4" style={{fontFamily: "Poppins-Regular"}}>{message}</Text>
          
          <View className="flex-row justify-center gap-2">
            <TouchableOpacity 
              onPress={onClose} 
              className="border border-gray-500 p-3 px-8 rounded"
            >
              <Text className="text-gray-700" style={{fontFamily: "Poppins-Regular"}}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onConfirm} 
              className="bg-orange-300 p-3 px-8 rounded-lg"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-gray-700" style={{fontFamily: "Poppins-Regular"}}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;
