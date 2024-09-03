import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import UserCard from '../components/UserCard';
import SearchInput from '../components/SearchInput';
import ConfirmationPopup from '../components/ConfirmationPopup';
import EditUserModal from '../components/EditUserModal';
import FilterSelect from '../components/FilterSelect';
import AlertMessage from '../components/AlertMessage';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const roleOptions = [
    { label: 'All', value: 'All' },
    { label: 'Student', value: 'Student' },
    { label: 'Lecturer', value: 'Lecturer' },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/all-users`);
      setUsers(response.data.users);
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Failed to fetch users');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch users initially
    fetchUsers();

    // Set up an interval to fetch users every second
    const intervalId = setInterval(fetchUsers, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.indexNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'All' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalVisible(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_SERVER_URL}/delete-user/${selectedUser?.indexNumber}`);
      setAlertType('success');
      setAlertMessage(response.data.message || 'User deleted successfully');
      setAlertVisible(true);
      setUsers(users.filter(user => user.indexNumber !== selectedUser?.indexNumber));
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Failed to delete the user');
      setAlertVisible(true);
    } finally {
      setIsConfirmationVisible(false);
    }
  };

  const saveUserDetails = (updatedUser) => {
    setUsers(users.map(user => user.indexNumber === updatedUser.indexNumber ? updatedUser : user));
  };

  return (
    <View className="p-3 flex-1 bg-white">
      {/* Search Input */}
      <SearchInput
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={"Search Full Name or Index Number"}
      />

      {/* Role Filter Dropdown */}
      <View className="mt-2">
        <FilterSelect
          options={roleOptions}
          selectedValue={selectedRole}
          onSelect={setSelectedRole}
        />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                userName={user.fullName}
                userRole={user.role}
                userClass={user?.classValue}
                indexNumber={user.indexNumber}
                onLongPress={() => handleDelete(user)} // Long press to delete
                onEdit={() => handleEdit(user)}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>
              No users found.
            </Text>
          )}
        </ScrollView>
      )}

      {/* Confirmation Popup for Deleting User */}
      <ConfirmationPopup
        visible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${selectedUser?.fullName}?`}
        title={`Confirm Delete`}
      />

      {/* Edit User Modal */}
      <EditUserModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={selectedUser}
        onSave={saveUserDetails}
      />

      {/* Alert Message */}
      <AlertMessage
        visible={alertVisible}
        onDismiss={() => setAlertVisible(false)}
        message={alertMessage}
        type={alertType}
      />
    </View>
  );
};

export default ManageUsers;
