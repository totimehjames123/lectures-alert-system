import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import getCurrentUser from '../utils/getCurrentUser';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AlertMessage from '../components/AlertMessage';
import FormTitle from '../components/FormTitle';
import storeCurrentUser from '../utils/storeCurrentUser';

const UpdatePassword = ({ navigation }) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    // Fetch the current user's index number from AsyncStorage
    const fetchIndexNumber = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setIndexNumber(currentUser.indexNumber);
      }
    };

    fetchIndexNumber();
  }, []);

  const handleUpdatePassword = async () => {
  if (!currentPassword.trim() || !newPassword.trim()) {
    setAlertType('error');
    setAlertMessage('Please fill in all fields');
    setAlertVisible(true);
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/update-password`, {
      indexNumber,
      currentPassword,
      newPassword,
    });

    if (response.status === 200) {
      setAlertType('success');
      setAlertMessage('Password updated successfully');
      setAlertVisible(true);
      storeCurrentUser({});

      // Delay navigation after showing the message
      setTimeout(() => {
        setAlertVisible(false);
        // Re-verify user after clearing storage
        navigation.navigate('Login');
      }, 2000); 

    } else {
      setAlertType('error');
      setAlertMessage(response.data.message || 'Failed to update password');
      setAlertVisible(true);
    }
  } catch (error) {
    setAlertType('error');
    setAlertMessage(error.response?.data?.message || 'Password update failed');
    setAlertVisible(true);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FormTitle title={'Update Password'} subTitle={'Provide your current password and set a new password.'} moreClass={'mb-3'} />
          <FormInput
            icon={'lock-closed-outline'}
            moreClass={'mb-2'}
            onChangeText={setCurrentPassword}
            value={currentPassword}
            secureTextEntry
            label='Current Password'
          />
          <FormInput
            icon={'lock-open-outline'}
            moreClass={'mb-2'}
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
            label='New Password'
          />
          <FormButton
            title={!loading ? 'Update Password' : <ActivityIndicator color="#fff" />}
            onPress={handleUpdatePassword}
            disabled={loading}
          />
        </View>
      </ScrollView>

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default UpdatePassword;
