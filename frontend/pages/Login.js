import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import FormTitle from '../components/FormTitle';
import AlertMessage from '../components/AlertMessage';
import {getExpoPushToken} from '../utils/getExpoPushToken';
import getCurrentUser from '../utils/getCurrentUser';
import storeCurrentUser from '../utils/storeCurrentUser';
import CheckLoginAndNavigate from '../utils/CheckLoginAndNavigate';

const Login =  ({ navigation }) => {

  const [indexNumber, setIndexNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');  

  const validateInputs = () => {
    if (!indexNumber.trim()) return 'Index Number is required'  ;
    if (!password.trim()) return 'Password is required';
    return null;
  };

  const handleLogin = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/login`, {
        indexNumber,
        password,
        expoPushToken: (await getExpoPushToken()).toString()
      });

      if (response.status === 200) {
        setIndexNumber('')
        setPassword('')
        setAlertType('success');
        setAlertMessage(response.data.message || "Logged in successfully");
        setAlertVisible(true);
        await storeCurrentUser(response.data.user)

        const user = await getCurrentUser();

        // Navigate to Home or another screen
        navigation.navigate('BottomTabNavigation');
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Login failed');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Login failed');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      <CheckLoginAndNavigate passedPath={"BottomTabNavigation"} failedPath={"Login"}/>

        <View style={{ padding: 20 }}>
          <FormTitle title={'Login'} subTitle={'Provide your login credentials.'} moreClass={'mb-3'} />
          <FormInput
            icon={'id-card-outline'}
            moreClass={'mb-2'}
            onChangeText={setIndexNumber}
            value={indexNumber}
            label='Index Number'
          />
          <FormInput
            icon={'lock-closed-outline'}
            moreClass={'mb-2'}
            onChangeText={setPassword}
            secureTextEntry
            value={password}
            label='Password'
          />
          
          <FormButton
            title={!loading ? 'Sign in' : <ActivityIndicator color="#fff" />}
            onPress={handleLogin}
            disabled={loading}
          />

          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#6B6B6B', fontFamily: 'Poppins-Regular' }}>Have you forgotten your password?{" "}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={{ color: '#FFC107', fontFamily: 'Poppins-Regular' }}>Reset it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 20, left: '50%', transform: [{ translateX: -50 }] }}>
        <Image
          source={require('../assets/splash.png')} // Replace with your logo URL or local path
          style={{ width: 100, height: 100 }} // Adjust size as needed
        />
      </View>

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default Login;
