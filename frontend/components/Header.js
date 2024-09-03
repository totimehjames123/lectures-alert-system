import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';

const Header = ({ title, description, isShowSearchIcon }) => {
  const navigation = useNavigation();
  const user = useSelector(selectUser); // Get user data from Redux store

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good morning';
    } else if (currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const greeting = user ? getGreeting() : '';
  const fullName = user ? user.fullName : '';

  return (
    <View className="flex-row items-center gap-x-5 bg-white pt-16">
      {/* Text Container */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 24, fontFamily: 'Poppins-Regular' }}>{title}</Text>
        <Text style={{ color: 'gray', fontFamily: 'Poppins-Regular' }}>
          {description ? description : `${greeting}, ${fullName.split(' ')[0]}!`}
        </Text>
      </View>

      {/* Search Icon */}
      {isShowSearchIcon && <TouchableOpacity
        className="p-2 rounded-full"
        onPress={() => navigation.navigate("SearchStack")}
      >
        <Ionicons
          name="search-outline"
          size={25}
          color="#9E9E9E" 
        />
      </TouchableOpacity>}

      {/* Profile Picture */}
      <TouchableOpacity onPress={() => navigation.navigate("ProfileStack")}>
        <Image
          source={require('./../assets/profile-picture.png')}
          className="w-12 h-12 rounded-full"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
