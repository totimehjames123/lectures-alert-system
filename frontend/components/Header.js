import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import getCurrentUser from '../utils/getCurrentUser';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, description, isShowSearchIcon }) => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setFullName(user?.fullName);
      }
    };
    setGreeting(getGreeting());

    fetchUser();
  }, []);

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

  return (
    <View className="flex-row items-center gap-x-5 bg-white pt-16">
      {/* Text Container */}
      <View className="flex-1">
        <Text className="text-3xl" style={{ fontFamily: 'Poppins-Regular' }}>{title}</Text>
        <Text className="text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>{description ? description : greeting + ", " + fullName?.split(' ')[0] + "!"}</Text>
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
