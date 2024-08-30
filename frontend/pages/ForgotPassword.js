import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import FormTitle from '../components/FormTitle';
import AlertMessage from '../components/AlertMessage';
import { getExpoPushToken } from '../utils/getExpoPushToken';

const ForgotPassword = ({ navigation }) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Function to validate email address
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate form inputs
  const validateInputs = () => {
    if (!indexNumber.trim()) return 'Index Number is required';
    if (!email.trim()) return 'Email is required';
    if (!isValidEmail(email)) return 'Invalid email address';
    return null;
  };

  const handleForgotPassword = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/forgot-password`, {
        indexNumber,
        email,
        expoPushToken: (await getExpoPushToken()).toString(),
      });

      if (response.status === 200) {
        setAlertType('success');
        setAlertMessage(response.data.message || 'Password reset email sent successfully');
        setAlertVisible(true);
        // navigation.navigate('Login');
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Failed to send reset email');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Password reset failed');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FormTitle title={'Forgot Password'} subTitle={'Enter your index number and email to reset your password. If you\'ve not recieved your mail, kindly resend your details again.'} moreClass={'mb-3'} />
          <FormInput
            icon={'id-card-outline'}
            moreClass={'mb-2'}
            onChangeText={setIndexNumber}
            value={indexNumber}
            label='Index Number'
          />
          <FormInput
            icon={'mail-outline'}
            moreClass={'mb-2'}
            onChangeText={setEmail}
            value={email}
            label='Email'
          />
          <FormButton
            title={!loading ? 'Send Verification Code' : <ActivityIndicator color="#fff" />}
            onPress={handleForgotPassword}
            disabled={loading}
          />
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#6B6B6B', fontFamily: 'Poppins-Regular' }}>Recieved your verification code?{" "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={{ color: '#FFC107', fontFamily: 'Poppins-Regular' }}>Reset</Text>
            </TouchableOpacity>
          </View>
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

export default ForgotPassword;
