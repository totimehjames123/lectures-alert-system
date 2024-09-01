import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchablePicker from './SearchablePicker';
import { classes } from '../utils/constants';
import CommentField from './CommentField';
import axios from 'axios';
import getCurrentUser from '../utils/getCurrentUser'; // Import the function to fetch current user
import AlertMessage from './AlertMessage'; // Import the custom AlertMessage component

const CustomNotificationModal = ({ visible, onClose }) => {
    const [classValue, setClassValue] = useState('CPS 2B');
    const [comment, setComment] = useState('');
    const [lecturerDetails, setLecturerDetails] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state
    const [alert, setAlert] = useState({ visible: false, message: '', type: 'success' });

    useEffect(() => {
        const fetchLecturerDetails = async () => {
            const user = await getCurrentUser();
            if (user) {
                setLecturerDetails({
                    indexNumber: user.indexNumber,
                    fullName: user.fullName,
                });
            }
        };
        fetchLecturerDetails();
    }, []);

    const handleConfirm = async () => {
        if (!lecturerDetails) {
            setAlert({
                visible: true,
                message: 'Unable to fetch lecturer details.',
                type: 'error'
            });
            return;
        }

        if (!classValue || !comment) { // Validate fields
            setAlert({
                visible: true,
                message: 'Please fill in all fields.',
                type: 'warning'
            });
            return;
        }

        setLoading(true); // Start loading

        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/send-custom-notification`, {
                classValue,
                message: comment,
                lecturerIndexNumber: lecturerDetails.indexNumber,
                lecturerName: lecturerDetails.fullName,
            });
            if (response.status === 200) {
                setAlert({
                    visible: true,
                    message: response.data.message || 'Notifications sent successfully.',
                    type: 'success'
                });
                // Delay closing the modal and clearing fields
                setTimeout(() => {
                    setAlert({ ...alert, visible: false });
                    setClassValue('CPS 2B'); // Reset the class value
                    setComment(''); // Clear the comment field
                    onClose(); // Close the modal
                }, 2000); // Show alert for 2 seconds
            } else {
                setAlert({
                    visible: true,
                    message: response.data.message || 'Failed to send notification.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.log('Error sending notification:', error);
            setAlert({
                visible: true,
                message: error.response?.data?.message || 'An error occurred while sending notification.',
                type: 'error'
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                <View className="bg-white p-5 rounded-lg w-5/5 relative">
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-3 right-3"
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-lg text-center" style={{ fontFamily: "Poppins-Regular" }}>Send a Notification</Text>
                    <Text className="text-xs text-gray-600 text-center mb-4" style={{ fontFamily: "Poppins-Regular" }}>Send a customized notification to your students</Text>

                    <View>
                        <SearchablePicker
                            icon="grid-outline"
                            label="Class"
                            options={classes}
                            selectedValue={classValue}
                            onSelect={setClassValue}
                            moreClass={'mb-2'}
                        />
                        <CommentField
                            moreClass="mb-4"
                            onChangeText={setComment}
                            value={comment}
                            label="Write a message"
                            numberOfLines={undefined}
                        />
                    </View>

                    <View className="flex-row justify-center gap-2">
                        <TouchableOpacity
                            onPress={onClose}
                            className="border border-gray-500 p-3 px-8 rounded"
                        >
                            <Text className="text-gray-700" style={{ fontFamily: "Poppins-Regular" }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            className="bg-orange-300 p-3 px-8 rounded-lg"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-gray-700" style={{ fontFamily: "Poppins-Regular" }}>Send</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <AlertMessage
                visible={alert.visible}
                onDismiss={() => setAlert({ ...alert, visible: false })}
                message={alert.message}
                type={alert.type}
            />
        </Modal>
    );
};

export default CustomNotificationModal;
