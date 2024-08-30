import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SearchablePicker from '../components/SearchablePicker';
import AlertMessage from '../components/AlertMessage';
import { classes, roleOptions } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have installed @expo/vector-icons

const EditUserModal = ({ visible, onClose, user, onSave }) => {
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

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setIndexNumber(user.indexNumber || '');
      setEmail(user.email || '');
      setContact(user.contact || '');
      setClassValue(user.classValue || '');
      setRole(user.role);
    }
  }, [user]);

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

  const handleSave = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      setAlertType('error');
      setAlertMessage(errorMessage);
      setAlertVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/update-profile/${indexNumber}`,
        { fullName, email, contact, classValue, role }
      );

      if (response.status === 200) {
        onSave(response.data);
        onClose();
      } else {
        setAlertType('error');
        setAlertMessage(response.data.message || 'Failed to update user');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Failed to update user');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <View className="bg-white p-6 rounded-lg w-11/12 h-5/6 relative mx-2">
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', top: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Text className="text-xl mb-4" style={{fontFamily: "Poppins-Regular"}}>Edit User</Text>

            <FormInput
              icon="person-outline"
              value={fullName}
              onChangeText={setFullName}
              label="Full Name"
              moreClass="mb-3"
            />
            <FormInput
              icon="id-card-outline"
              value={indexNumber}
              onChangeText={setIndexNumber}
              label="Index Number"
              moreClass="mb-3"
              editable={false} // Index number should not be editable
            />
            <FormInput
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              label="Email"
              moreClass="mb-3"
            />
            <FormInput
              icon="call-outline"
              value={contact}
              onChangeText={setContact}
              label="Contact"
              moreClass="mb-3"
            />
            <SearchablePicker
              icon="grid-outline"
              label="Role"
              options={roleOptions}
              selectedValue={role}
              onSelect={setRole}
              moreClass="mb-3"
            />
            {role === 'Student' && (
              <SearchablePicker
                icon="grid-outline"
                label="Class"
                options={classes}
                selectedValue={classValue}
                onSelect={setClassValue}
                moreClass="mb-3"
              />
            )}

            <View className="flex-row justify-between">
              <FormButton
                title={loading ? <ActivityIndicator color="#fff" /> : 'Update'}
                onPress={handleSave}
                disabled={loading}
                color="green"
              />
            </View>
          </ScrollView>
        </View>
      </View>

      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </Modal>
  );
};

export default EditUserModal;
