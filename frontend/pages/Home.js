import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import SupportiveTools from '../components/SupportiveTools';
import UpcomingLecturesContainer from '../components/UpcomingLecturesContainer';
import CountCardContainer from '../components/CountCardContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const [data, setData] = useState([
    { id: '1', type: 'header' },
    { id: '2', type: 'countCards' },
    { id: '3', type: 'supportiveTools' },
    { id: '4', type: 'upcomingLectures' },
  ]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await AsyncStorage.getItem('currentUser');
        if (!user) {
          // Navigate to Login screen if no user is found
          nav.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking login status', error);
        Alert.alert('Error', 'There was an issue checking your login status.');
      }
    };

    // Check login status on component mount
    checkLoginStatus();

    // Set an interval to check login status periodically (e.g., every minute)
    const intervalId = setInterval(checkLoginStatus, 60000); // 60000 ms = 1 minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [nav]);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData([
      { id: '1', type: 'header' },
      { id: '2', type: 'countCards' },
      { id: '3', type: 'supportiveTools' },
      { id: '4', type: 'upcomingLectures' },
    ]);
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'header':
        return <Header title={'Dashboard'} isShowSearchIcon={true} />;
      case 'countCards':
        return <CountCardContainer />;
      case 'supportiveTools':
        return <SupportiveTools />;
      case 'upcomingLectures':
        return <UpcomingLecturesContainer />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ flexGrow: 1, padding: 16, backgroundColor: 'white' }}
        refreshing={loading}
        onRefresh={handleRefresh}
        ListEmptyComponent={<ActivityIndicator size="large" color="#0000ff" />}
      />
    </View>
  );
};

export default Home;
