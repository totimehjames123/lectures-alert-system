// components/SearchInput.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';

const SearchInput = ({ searchQuery, onChangeText, moreClass }) => {
  return (
    <View className={`px-3 ${moreClass} flex-row items-center bg-white border rounded-md border-gray-300 `}>
        <Ionicons name={'search-outline'} size={20} color="gray" className="mr-2" />

      <TextInput
        className="p-2 rounded-md w-full"
        placeholder="Search by Index Number or Full Name"
        value={searchQuery}
        autoFocus
        onChangeText={onChangeText}
        style={{ fontFamily: 'Poppins-Regular' }}
      />
    </View>
  );
};

export default SearchInput;
