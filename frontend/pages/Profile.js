import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text, Image } from 'react-native';
import getCurrentUser from '../utils/getCurrentUser'; // Adjust the import path as needed
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import AlertMessage from '../components/AlertMessage';
import CheckLoginAndNavigate from '../utils/CheckLoginAndNavigate';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Navigate to Login screen if no user data is found
          navigation.navigate('Login');
        }
      } catch (error) {
        setAlertType('error');
        setAlertMessage('Failed to fetch user data');
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data initially
    fetchUserData();

    // Set up interval to fetch user data every second
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return null; // This will ensure that if user is not found, nothing is rendered until navigation occurs
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <CheckLoginAndNavigate passedPath={'Profile'} failedPath={'Login'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Image
              source={require('./../assets/profile-picture.png')}
              style={{ width: 128, height: 128, borderRadius: 64 }}
            />
          </View>
          <FormInput
            icon="person-outline"
            moreClass="mb-2"
            value={user.fullName}
            label="Full Name"
            disabled={true}
          />
          <FormInput
            icon="id-card-outline"
            moreClass="mb-2"
            value={user.indexNumber}
            label="Index Number"
            disabled={true}
          />
          <FormInput
            icon="mail-outline"
            moreClass="mb-2"
            value={user.email}
            label="Email"
            disabled={true}
          />
          <FormInput
            icon="call-outline"
            moreClass="mb-2"
            value={user.contact}
            label="Contact"
            disabled={true}
          />
          <FormInput
            icon="grid-outline"
            label="Role"
            value={user.role}
            disabled={true}
            moreClass="mb-2"
          />
          <FormButton
            title="Change Your Password"
            onPress={() => navigation.navigate("UpdatePassword")}
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

export default Profile;
