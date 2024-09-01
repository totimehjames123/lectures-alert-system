import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const SomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
        setUsers(response.data.users);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="p-3 flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {users.length > 0 ? (
          users.map((user) => (
            <View key={user._id} className="p-2 border-b border-gray-200">
              <Text className="text-lg font-bold">{user.fullName}</Text>
              <Text>{user.role}</Text>
              <Text>{user.indexNumber}</Text>
              {user.classValue && <Text>Class: {user.classValue}</Text>}
            </View>
          ))
        ) : (
          <Text className="text-center text-gray-500">No users found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default SomePage;
