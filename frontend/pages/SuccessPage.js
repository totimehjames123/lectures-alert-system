import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SuccessPage = ({ navigation }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <View className="mb-3">
        <MaterialIcons name="check-circle" size={100} color="#4CAF50" />
      </View>
      <Text className="text-3xl  text-green-600 mb-2" style={{fontFamily: 'Poppins-Regular'}}>Congratulations!</Text>
      <Text className="text-md text-gray-600 text-center mb-5" style={{fontFamily: 'Poppins-Regular'}}>
        Your password has been successfully reset. You can now log in with your new password.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{fontFamily: 'Poppins-Regular'}} className="text-md text-yellow-500">Go back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessPage;
