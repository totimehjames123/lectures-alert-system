import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import getCurrentUser from '../utils/getCurrentUser'; // Adjust the import path as needed
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormButton from '../components/FormButton';
import AlertMessage from '../components/AlertMessage';
import { classes, roleOptions } from '../utils/constants';
import FormTitle from '../components/FormTitle';
import SearchablePicker from '../components/SearchablePicker';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import CheckLoginAndNavigate from '../utils/CheckLoginAndNavigate';

const Profile = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setAlertType('error');
        setAlertMessage('Failed to fetch user data');
        setAlertVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No user data found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <CheckLoginAndNavigate passedPath={'ProfileStack'} failedPath={'Login'}/>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          <View className="flex-row justify-center mb-9">
            <Image
              source={require('./../assets/profile-picture.png')}
              className="w-32 h-32 rounded-full"
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
            moreClass={'mb-2'}
          />
          

          {/* You can add buttons or other interactive components if needed */}
          <FormButton
            title="Change Your Password"
            onPress={() => navigation.navigate("UpdatePassword")}
            disabled={loading} // Adjust the functionality as needed
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
