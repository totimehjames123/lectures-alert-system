import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import FormTitle from '../components/FormTitle';
import AlertMessage from '../components/AlertMessage';

const ResetPassword = ({ navigation }) => {
  const [indexNumber, setIndexNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!verificationCode.trim()) return 'Verification Code is required';
    if (!email.trim()) return 'Email is required';
    if (!isValidEmail(email)) return 'Invalid email address';
    if (!password.trim()) return 'Password is required';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleResetPassword = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/reset-password`, {
        indexNumber,
        resetToken: verificationCode,
        email,
        newPassword: password,
      });

      if (response.status === 200) {
        setAlertType('success');
        setAlertMessage(response.data.message || 'Password reset successful!');
        setAlertVisible(true);
        setTimeout(() => {
          navigation.navigate('SuccessPage');
        }, 1000); // Navigate after a short delay to show the success message
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Failed to reset password');
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
          <FormTitle title={'Reset Password'} subTitle={'Fill in the fields below to reset your password.'} moreClass={'mb-3'} />

          {/* Index Number Input */}
          <FormInput
            icon={'id-card-outline'}
            moreClass={'mb-2'}
            onChangeText={setIndexNumber}
            value={indexNumber}
            label='Index Number'
          />

          {/* Verification Code Input */}
          <FormInput
            icon={'key-outline'}
            moreClass={'mb-2'}
            onChangeText={setVerificationCode}
            value={verificationCode}
            label='Verification Code'
            keyboardType='numeric'
          />

          {/* Email Input */}
          <FormInput
            icon={'mail-outline'}
            moreClass={'mb-2'}
            onChangeText={setEmail}
            value={email}
            label='Email'
            keyboardType='email-address'
          />

          {/* New Password Input */}
          <FormInput
            icon={'lock-closed-outline'}
            moreClass={'mb-2'}
            onChangeText={setPassword}
            value={password}
            label='New Password'
            secureTextEntry
          />

          {/* Confirm Password Input */}
          <FormInput
            icon={'lock-closed-outline'}
            moreClass={'mb-2'}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            label='Confirm Password'
            secureTextEntry
          />

          {/* Reset Password Button */}
          <FormButton
            title={!loading ? 'Reset Password' : <ActivityIndicator color="#fff" />}
            onPress={handleResetPassword}
            disabled={loading}
          />

          {/* Navigate to Login if user remembers password */}
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#6B6B6B', fontFamily: 'Poppins-Regular' }}>Didn't recieve code?{" "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{ color: '#FFC107', fontFamily: 'Poppins-Regular' }}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Alert Message */}
      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default ResetPassword;
