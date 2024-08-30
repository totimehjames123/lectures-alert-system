import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import AlertMessage from '../components/AlertMessage';
import { classes, roleOptions } from '../utils/constants';
import FormTitle from '../components/FormTitle';
import SearchablePicker from '../components/SearchablePicker';

const AddUser = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [classValue, setClassValue] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');  

  const validateInputs = () => {
    if (!fullName.trim()) return 'Full Name is required';
    if (!indexNumber.trim()) return 'Index Number is required';
    
    // Email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    
    // Phone number validation
    if (!contact.trim()) return 'Contact is required';
    if (!/^\d{10}$/.test(contact)) return 'Contact must be a 10-digit number';
    
    if (role === 'Student' && !classValue) return 'Class is required for students';
    return null;
  };

  const handleAddUser = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/add-user`, {
        fullName,
        indexNumber,
        email,
        contact,
        classValue: role === 'Student' ? classValue : null,
        role,
      });

      if (response.status === 201) {
        setAlertType('success');
        setAlertMessage('User created successfully');
        setAlertVisible(true);

        // Clear form fields
        setFullName('');
        setIndexNumber('');
        setEmail('');
        setContact('');
        setClassValue('');

        // Wait for 2 seconds before navigating
        setTimeout(() => {
          navigation.navigate('ManageUsers'); // Navigate to ManageUsers screen
        }, 2000);
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Failed to create user');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Failed to create user');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <FormTitle title={'New User'} subTitle={'Kindly fill the form below to create an account'} moreClass={'mb-3'} />

          <FormInput
            icon="person-outline"
            moreClass="mb-2"
            onChangeText={setFullName}
            value={fullName}
            label="Full Name"
          />
          <FormInput
            icon="id-card-outline"
            moreClass="mb-2"
            onChangeText={setIndexNumber}
            value={indexNumber}
            label="Index Number"
          />
          <FormInput
            icon="mail-outline"
            moreClass="mb-2"
            onChangeText={setEmail}
            value={email}
            label="Email"
          />
          <FormInput
            icon="call-outline"
            moreClass="mb-2"
            onChangeText={setContact}
            value={contact}
            label="Contact"
          />
          <SearchablePicker
            icon="grid-outline"
            label="Role"
            options={roleOptions}
            selectedValue={role}
            onSelect={setRole}
            moreClass={'mb-2'}
          />
          {role === 'Student' && (
          <SearchablePicker
            icon="grid-outline"
            label="Class"
            options={classes}
            selectedValue={classValue}
            onSelect={setClassValue}
            moreClass={'mb-2'}
          />
          )}

          <FormButton
            title={!loading ? 'Add' :  <ActivityIndicator color="#fff" />}
            onPress={handleAddUser}
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

export default AddUser;
