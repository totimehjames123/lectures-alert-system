import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import SearchInput from '../components/SearchInput';
import ConfirmationPopup from '../components/ConfirmationPopup';
import EditUserModal from '../components/EditUserModal';
import FilterSelect from '../components/FilterSelect';
import { getLecturers } from '../utils/getLecturers'; // Importing the getLecturers function
import Header from '../components/Header';
import LecturerCard from '../components/LecturerCard';

const AllLecturers = ({navigation}) => {
  const [lecturers, setLecturers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const fetchedLecturers = await getLecturers();
        setLecturers(fetchedLecturers);
      } catch (error) {
        console.error('Error fetching lecturers:', error);
      }
    };

    fetchLecturers();
  }, []);

  const filteredLecturers = lecturers.filter((lecturer) => {
    const matchesSearch = lecturer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecturer.indexNumber.toLowerCase().includes(searchQuery.toLowerCase());


    return matchesSearch ;
  });

  const handleEdit = (lecturer) => {
    setSelectedUser(lecturer);
    setIsEditModalVisible(true);
  };

  const handleDelete = (lecturer) => {
    setSelectedUser(lecturer);
    setIsConfirmationVisible(true);
  };

  const confirmDelete = () => {
    setLecturers(lecturers.filter(lecturer => lecturer.id !== selectedUser.id));
    setIsConfirmationVisible(false);
  };

  const saveUserDetails = (updatedLecturer) => {
    setLecturers(lecturers.map(lecturer => lecturer.id === updatedLecturer.id ? updatedLecturer : lecturer));
  };

  return (
    <View className="p-3 flex-1 bg-white">
      <Header title={'All Lecturers'} description={'Select a lecture to schedule'} isShowSearchIcon={false}/>
      {/* Search Input */}
      <SearchInput
        searchQuery={searchQuery}
        onChangeText={setSearchQuery}
        moreClass={'my-2'}
        placeholder={'Search Full Name or Index Number'}
      />

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        {filteredLecturers.length > 0 ? (
          filteredLecturers.map((lecturer) => (
            <LecturerCard
              key={lecturer._id}
              userName={lecturer.fullName}
              userRole={lecturer.indexNumber}
              indexNumber={lecturer.indexNumber}
              onEdit={() => handleEdit(lecturer)}
              onDelete={() => handleDelete(lecturer)}
              isShowAction={false}
              onPress={() => navigation.navigate("ScheduleLecture", { 
                fullName: lecturer.fullName, 
                indexNumber: lecturer.indexNumber 
              })}
            />
          ))
        ) : (
          <Text className="text-center text-gray-500" style={{ fontFamily: 'Poppins-Regular' }}>
            No lecturers found.
          </Text>
        )}
      </ScrollView>

      {/* Confirmation Popup for Deleting Lecturer */}
      <ConfirmationPopup
        visible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete ${selectedUser?.fullName}?`}
      />

      {/* Edit Lecturer Modal */}
      <EditUserModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={selectedUser}
        onSave={saveUserDetails}
      />
    </View>
  );
};

export default AllLecturers;
